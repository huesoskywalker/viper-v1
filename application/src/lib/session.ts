import { authOptions } from "../utils/auth"
import { Session, getServerSession } from "next-auth"

export const preloadViperSession = () => {
    void getCurrentViper()
}

export const getCurrentViper = async (): Promise<Session | null> => {
    const session: Session | null = await getServerSession(authOptions)
    return session
}
