import { PageProps } from "../../lib/utils"
import { Suspense } from "react"
import { CommentSkeleton } from "@/ui/CommentSkeleton"
import { preloadEventComments } from "../../lib/events"
import { EventComments } from "./_components/EventComments"

export default async function EventPage({ params }: PageProps) {
    const eventId: string = params.id

    preloadEventComments(eventId)

    return (
        <div className="space-y-8 lg:space-y-6 ">
            <div className="text-xl font-medium text-gray-400/80  w-full ">
                <div className="space-y-6">
                    <Suspense fallback={<CommentSkeleton />}>
                        {/* @ts-expect-error Async Server Component */}
                        <EventComments eventId={eventId} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
