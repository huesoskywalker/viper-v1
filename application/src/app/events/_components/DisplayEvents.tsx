import { Event } from "@/types/event"
import { EventCard } from "./EventCard"
import { EditEventLink } from "./EditEventLink"

export async function DisplayEvents({
    eventsPromise,
    dashboard,
}: {
    eventsPromise: Promise<Event[]>
    dashboard: boolean
}) {
    const events: Event[] = await eventsPromise
    if (events.length === 0) {
        return (
            <div className="flex justify-center align-text-bottom">
                <p className="text-gray-400  text-xs">Hey buddy, create your first event</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                {events.map((event: Event) => {
                    const eventAddress = event.location.address
                    return (
                        <div
                            data-test="display-events"
                            className="w-full lg:w-auto"
                            key={JSON.stringify(event._id)}
                        >
                            {dashboard ? (
                                <EditEventLink href={`/dashboard/myevents/${event._id}`} />
                            ) : null}
                            <EventCard
                                image={event.image}
                                title={event.title}
                                content={event.content}
                                province={eventAddress.province}
                                country={eventAddress.country}
                                date={event.date as string}
                                href={`/${event._id}`}
                            />
                        </div>
                    )
                })}
            </div>
        </>
    )
}
