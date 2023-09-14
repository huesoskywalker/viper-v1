import { getEventById } from "@/lib/events"
import { Event } from "@/types/event"
import { UpdateEventForm } from "./UpdateEventForm"

export default async function UpdateEvent({ eventId }: { eventId: string }) {
    const eventResponse = await fetch(`/api/event/${eventId}`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    })
    const toUpdateEvent: Event = await eventResponse.json()
    if (!toUpdateEvent)
        return (
            <h1 className="text-gray-400 text-xl">
                Something should we do here, this does not work, most sure And the ERROR will crash
                the console.
            </h1>
        )

    const event_id = JSON.stringify(toUpdateEvent._id).replace(/['"]+/g, "")

    return (
        <>
            <UpdateEventForm
                eventId={event_id}
                eventOrganizerId={toUpdateEvent.organizer._id}
                eventTitle={toUpdateEvent.title}
                eventContent={toUpdateEvent.content}
                // eventLocation={toUpdateEvent.location}
                eventDate={toUpdateEvent.date as string}
                eventCategory={toUpdateEvent.category}
                eventImage={toUpdateEvent.image}
                eventPrice={toUpdateEvent.price}
            />
        </>
    )
}
