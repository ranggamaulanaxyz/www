import { json } from "stream/consumers";
import type { Token } from "~/modules/auth/types";

export interface FetcherRequestInit extends RequestInit {
    accessToken?: string;
    refreshToken?: string;
}

export async function fetcher(input: URL | RequestInfo, init?: FetcherRequestInit) {
    const {accessToken, refreshToken, ...requestInit} = init || {}
    const headers = new Headers(requestInit.headers)
    if(accessToken && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${accessToken}`)
    }

    const requestInput = input instanceof Request && refreshToken ? input.clone() : input;
    const response = await fetch(requestInput, {...requestInit, headers})
    
    if (response.status === 401 && refreshToken) {
        const refreshResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({refresh_token: refreshToken})
        })
    }

    return response
}

export interface CustomFetchOptions extends RequestInit {
  accessToken?: string;
  refreshToken?: string;
  onTokenRefresh?: (token: Token) => Promise<void> | void;
}

/**
 * A wrapper around the native fetch API that automatically handles token refreshing.
 * If the response returns a 401 Unauthorized, and a refreshToken is provided,
 * it will call the refresh token endpoint, invoke the onTokenRefresh callback,
 * and retry the original request with the new access token.
 */
export async function customFetch(
  input: RequestInfo | URL,
  init?: CustomFetchOptions
): Promise<Response> {
  const { accessToken, refreshToken, onTokenRefresh, ...restInit } = init || {};

  const headers = new Headers(restInit.headers);
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Clone the Request if it's an instance of Request and we might need to retry,
  // to avoid "body already consumed" errors during retry.
  let requestInput = input;
  let retryRequestInput = input;
  if (input instanceof Request) {
    if (refreshToken) {
      requestInput = input.clone();
      retryRequestInput = input;
    }
  }

  const response = await fetch(requestInput, {
    ...restInit,
    headers,
  });

  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const newToken = (await refreshResponse.json()) as Token;

        if (onTokenRefresh) {
          await onTokenRefresh(newToken);
        }

        if (retryRequestInput instanceof Request) {
          retryRequestInput.headers.set("Authorization", `Bearer ${newToken.accessToken}`);
          return await fetch(retryRequestInput);
        } else {
          const retryHeaders = new Headers(restInit.headers);
          retryHeaders.set("Authorization", `Bearer ${newToken.accessToken}`);
          return await fetch(retryRequestInput, {
            ...restInit,
            headers: retryHeaders,
          });
        }
      }
    } catch (error) {
      console.error("Failed to refresh token in customFetch:", error);
    }
  }

  return response;
}