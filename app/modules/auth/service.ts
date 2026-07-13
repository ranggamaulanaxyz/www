import { apiGetUser } from "./api"
import type { User } from "./types"

async function getUser(token: string): Promise<User | null> {
    const user = await apiGetUser(token)
    return null
}