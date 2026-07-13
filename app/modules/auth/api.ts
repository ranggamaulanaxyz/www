import type { User } from "./types"

type UserApiError = {
    status: number
}

export async function apiGetUser(accessToken: string): Promise<{
    user: User | null,
    error: UserApiError | null
}> {
    const url = `${import.meta.env.PUBLIC_API_URL}/auth/me`
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (response.ok) {
        return {
            user: await response.json() as User,
            error: null
        }
    }

    return {
        user: null,
        error: {
            status: response.status
        }
    }
}