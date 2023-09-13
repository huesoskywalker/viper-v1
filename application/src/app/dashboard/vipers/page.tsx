import { getViperByUsername, getVipers } from "@/lib/vipers"
import { Suspense } from "react"
import Loading from "./loading"
import ViperSearchBar from "./_components/ViperSearchBar"
import { Viper } from "@/types/viper"
import { DisplayVipers } from "./_components/DisplayVipers"

export default async function VipersPage({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string }
}) {
    // Gotta check what's about the params we are not using, probably this is for the SearchBar
    // if that's the case, clean the code
    const vipers: Promise<Viper[] | null> = searchParams.search
        ? getViperByUsername(searchParams.search)
        : getVipers()
    if (!vipers) throw new Error("No vipers bro")

    return (
        <>
            <div className="space-y-6 space-x-2">
                <ViperSearchBar />
                <Suspense fallback={<Loading />}>
                    {/* @ts-expect-error Async Server Component */}
                    <DisplayVipers vipersPromise={vipers} />
                </Suspense>
            </div>
        </>
    )
}
