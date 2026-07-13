import { createCookieSessionStorage } from "react-router"

type UserToken = {
    accessToken: string,
    refreshToken: string,
}

const { getSession, commitSession, destroySession} = createCookieSessionStorage<UserToken>({
    cookie: {
        name: "session",
        httpOnly: true,
        sameSite: "strict",
        secrets: [import.meta.env.APP_SECRET],
        secure: import.meta.env.PROD
    }
})

export {getSession, commitSession, destroySession}