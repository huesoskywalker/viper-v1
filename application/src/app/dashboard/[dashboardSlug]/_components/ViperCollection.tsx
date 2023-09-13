import { Collection, Likes } from "@/types/viper"
import { CollectionEventCard } from "./CollectionEventCard"
import { getViperCollectionEvents, getViperLikedEvents } from "@/lib/vipers"
import { preloadEventById } from "@/lib/events"

export default async function ViperCollection({
    viperId,
    isCollection,
}: {
    viperId: string
    isCollection: boolean
}) {
    const collection: Collection[] | Likes[] = isCollection
        ? await getViperCollectionEvents(viperId)
        : await getViperLikedEvents(viperId)

    collection.map((event: Collection | Likes): void => {
        preloadEventById(JSON.stringify(event._id).replace(/['"]+/g, ""))
    })

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {collection.map((event: Collection | Likes) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <CollectionEventCard
                        viperId={viperId}
                        key={JSON.stringify(event._id)}
                        eventId={JSON.stringify(event._id)}
                        href={`${JSON.stringify(event._id)}`}
                        isCollection={isCollection}
                    />
                )
            })}
        </div>
    )
}
