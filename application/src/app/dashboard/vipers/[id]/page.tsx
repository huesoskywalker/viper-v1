import { PageProps } from "@/lib/utils"
import { preloadViperBlogs } from "@/lib/vipers"
import { Suspense } from "react"
import Loading from "./loading"
import { ViperBlogs } from "@/app/profile/_components/ViperBlogs"

export default async function ViperPage({ params }: PageProps) {
    const viperId: string = params.id

    // Using cache pattern built on top of parallel fetching
    preloadViperBlogs(viperId)

    return (
        <div className="flex justify-center">
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Server Component */}
                <ViperBlogs viperId={viperId} />
            </Suspense>
        </div>
    )
}
