import { Suspense } from "react"
import { PageProps } from "@/lib/utils"
import UpdateProfile from "./_components/UpdateProfile"

export default async function Layout({ children, params }: PageProps) {
    return (
        <div className="space-y-4">
            <Suspense
                fallback={<div className="text-yellow-400 text-sm">Do something pretty here</div>}
            >
                <UpdateProfile />
            </Suspense>

            <div>{children}</div>
        </div>
    )
}
