import { Suspense } from "react"
import { getEventsByCategory } from "@/lib/events"
import { PageProps } from "@/lib/utils"
import { Event } from "@/types/event"
import { DisplayEvents } from "../_components/DisplayEvents"
import Loading from "../loading"

export default async function CategoryPage({ params }: PageProps) {
    const category: string = params.category
    if (!category) throw new Error("No such category bro")

    const events: Promise<Event[]> = getEventsByCategory(category)
    return (
        <div className="space-y-4">
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <DisplayEvents eventsPromise={events} dashboard={false} />
            </Suspense>
        </div>
    )
}
