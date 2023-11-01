"use client"
import { SessionProvider } from "next-auth/react"
import { Auth } from "./Auth"

export default function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <SessionProvider>
            <Auth>{children}</Auth>
        </SessionProvider>
    )
}
