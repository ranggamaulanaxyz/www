import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { commitSession, getSession } from "./session.server"
import { createContext, type LoaderFunctionArgs } from "react-router";

export interface User {
    id: string;
    username: string;
}

export interface Token {
    accessToken: string,
    refreshToken?: string,
    tokenType: string,
    expiresIn: number
}

export interface AuthContext {
    token: Token | null;
    user: User | null;
}

export const sessionContext = createContext<AuthContext | null>(null)

async function authMiddleware({request, context}: LoaderFunctionArgs, next: () => Promise<Response>) {
    const session = await getSession(request.headers.get("Cookie"))
    const accessToken = session.get("accessToken")
    const refreshToken = session.get("refreshToken")

    if(accessToken) {
        const userApiResponse = await fetch(`${import.meta.env.API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (userApiResponse.ok) {
            const dataAuth = await userApiResponse.json()
            const dataAuthCamelCased = camelcaseKeys(dataAuth, {
                deep: true
            })
            const sessionContextValue: AuthContext = {
                token: {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    tokenType: dataAuthCamelCased.tokenType,
                    expiresIn: dataAuthCamelCased.expiresIn
                },
                user: {
                    id: dataAuthCamelCased.user.id,
                    username: dataAuthCamelCased.user.username
                }
            }
            context.set(sessionContext, sessionContextValue)
            return
        }

        if (userApiResponse.status === 401 && refreshToken) {
            const refreshTokenApiResponse = await fetch(`${import.meta.env.API_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(snakecaseKeys({refreshToken}, {deep: true}))
            })
            
            if(refreshTokenApiResponse.ok) {
                const dataRefresh = await refreshTokenApiResponse.json()
                const dataRefreshCamelCased = camelcaseKeys(dataRefresh, {
                    deep: true
                })

                const retryUserApiReponse = await fetch(`${import.meta.env.API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${dataRefreshCamelCased.accessToken}`
                    }
                })

                if(retryUserApiReponse.ok) {
                    const dataRetry = await retryUserApiReponse.json()
                    const dataRetryCamelCased = camelcaseKeys(dataRetry, {
                        deep: true
                    })
                    const sessionContextValue: AuthContext = {
                        token: {
                            accessToken: dataRefreshCamelCased.accessToken,
                            refreshToken: dataRefreshCamelCased.refreshToken,
                            tokenType: dataRefreshCamelCased.tokenType,
                            expiresIn: dataRefreshCamelCased.expiresIn
                        },
                        user: {
                            id: dataRetryCamelCased.user.id,
                            username: dataRetryCamelCased.user.username
                        }
                    }
                    context.set(sessionContext, sessionContextValue)

                    session.set("accessToken", dataRefreshCamelCased.accessToken)
                    session.set("refreshToken", dataRefreshCamelCased.refreshToken)

                    const response = await next()
                    response.headers.set("Set-Cookie", await commitSession(session))
                    return response
                }
                return
            }
        }
    }
    
}

export {authMiddleware}