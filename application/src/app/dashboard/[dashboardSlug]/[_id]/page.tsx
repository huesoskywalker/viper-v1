import { Suspense } from "react"
import { preloadEventById } from "@/lib/events"
import { PageProps } from "@/lib/utils"
import UpdateEvent from "./_components/UpdateEvent"

export default async function EventEditPage({ params }: PageProps) {
    const eventId: string = params._id

    // Can be good to make a function that returns only the editable Props of the Event
    preloadEventById(eventId)
    return (
        <div className=" w-full">
            <Suspense fallback={<div>Suspense from EditPage</div>}>
                {/* @ts-expect-error Async Server Component */}
                <UpdateEvent eventId={eventId} />
            </Suspense>
        </div>
    )
}
