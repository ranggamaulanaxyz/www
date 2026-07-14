export type Token = {
    accessToken: string,
    refreshToken: string,
    tokenType: string,
    expiresIn: number
}

export type User = {
    id: string;
    name: string;
    lastName?: string;
    email: string;
    verifiedAt?: string;
}

export type Session = {
    token?: Token,
    user?: User
}