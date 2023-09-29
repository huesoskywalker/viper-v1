import { Suspense } from "react"
import { sortEventByCategoryAndSlug } from "@/lib/events"
import { Event } from "@/types/event"
import { PageProps } from "@/lib/utils"
import Loading from "../../loading"
import { DisplayEvents } from "../../_components/DisplayEvents"

export default async function CategoryPage({ params }: PageProps) {
    // we might use URLSearchParams and make it better
    const category: string = params.category
    const property: string = params.sort
    // This will Render the closest Error.ts Error Boundary
    if (!category) throw new Error("No such category bro")

    // Let's retrieve this from the event endpoint sorting and filtering
    const events: Promise<Event[]> = sortEventByCategoryAndSlug(category, property)
    return (
        <div className="space-y-4">
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <DisplayEvents eventsPromise={events} dashboard={false} />
            </Suspense>
        </div>
    )
}
