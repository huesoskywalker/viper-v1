import { PageProps } from "@/lib/utils"
import { signIn, useSession } from "next-auth/react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const Auth = ({ children }: PageProps) => {
    const router: AppRouterInstance = useRouter()
    const { data: session, status } = useSession()
    const isUser = session?.user
    useEffect(() => {
        if (status === "loading") return
        if (status === "unauthenticated") {
            router.push("/")
        }
        if (!isUser) {
            router.push("/")
        }
    }, [isUser, status])

    return <>{children}</>
}
