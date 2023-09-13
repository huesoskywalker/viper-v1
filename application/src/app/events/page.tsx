import { Suspense } from "react"
import Loading from "./loading"
import { Event } from "@/types/event"
import { DisplayEvents } from "./_components/DisplayEvents"

export default async function EventsPage({}) {
    const fetchEvents = await fetch(`http:localhost:3000/api/event/all`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        cache: "no-cache",
    })
    const events: Promise<Event[]> = fetchEvents.json()
    return (
        <div className="space-y-9">
            <div className="flex justify-between">
                <Suspense fallback={<Loading />}>
                    {/* @ts-expect-error Async Server Component */}
                    <DisplayEvents eventsPromise={events} dashboard={false} />
                </Suspense>
            </div>
        </div>
    )
}
