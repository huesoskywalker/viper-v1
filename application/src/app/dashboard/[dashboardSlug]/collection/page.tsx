import { getCurrentViper } from "@/lib/session"
import { preloadViperCollectionEvents } from "@/lib/vipers"
import { Suspense } from "react"
import Loading from "../loading"
import ViperCollection from "../_components/ViperCollection"
import { Session } from "next-auth"

export default async function CollectionPage() {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) return <div>hold on viper, we coming for you</div>
    const viper = viperSession.user

    preloadViperCollectionEvents(viper._id)
    // const collection: Promise<Collection[]> = getViperCollectionEvents()

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <ViperCollection
                    // collectionPromise={collection}
                    isCollection={true}
                    viperId={viper!._id}
                />
            </Suspense>
        </div>
    )
}
