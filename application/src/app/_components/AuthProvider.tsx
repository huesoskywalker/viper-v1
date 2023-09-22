"use client"
import { SessionProvider, useSession } from "next-auth/react"
import { PageProps } from "../../lib/utils"
import { Auth } from "./Auth"

export default function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <SessionProvider>
            <Auth>{children}</Auth>
        </SessionProvider>
    )
}
