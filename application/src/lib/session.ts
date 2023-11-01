import { redirect } from "next/navigation"
import { authOptions } from "../utils/auth"
import { Session, getServerSession } from "next-auth"

export const preloadViperSession = () => {
    void getCurrentViper()
}

export const getCurrentViper = async (): Promise<Session> => {
    const session: Session | null = await getServerSession(authOptions)
    if (!session) {
        return redirect("/api/auth/signin")
    }
    return session
}
