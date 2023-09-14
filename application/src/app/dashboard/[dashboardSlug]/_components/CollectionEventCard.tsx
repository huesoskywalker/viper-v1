import Link from "next/link"
import Image from "next/image"
import { isEventCardAvailable } from "../_lib/isEventCardAvailable"
import { Event } from "@/types/event"
import { EventDate } from "@/app/[id]/_components/EventDate"

export const CollectionEventCard = async ({
    viperId,
    eventId,
    href,
    isCollection,
}: {
    viperId: string
    eventId: string
    href: string
    isCollection: boolean
}) => {
    const event_id: string = eventId.slice(1, -1)
    const link: string = href.slice(1, -1)
    // const eventPromise: Promise<Event | null> = getEventById(event_id)
    const eventPromise: Promise<Response> = fetch(`/api/event/${eventId}`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    })
    // const eventPromise: Promise<AxiosResponse<Event>> = axios.get<Event>(`/api/event/${eventId}`)
    const eventCardAvailableData: Promise<boolean> = isEventCardAvailable(event_id, viperId)

    const [eventData, eventCardAvailable] = await Promise.all([
        eventPromise,
        eventCardAvailableData,
    ])
    const event: Event = await eventData.json()
    if (!event) {
        return (
            <div>
                <h1 className="text-yellow-700 text-xs">
                    You have not participated neither liked any event, yet. Go for it !
                </h1>
            </div>
        )
    }
    const eventAddress = event.location.address

    return (
        <>
            {eventCardAvailable || !isCollection ? (
                <Link href={link} className="group block">
                    <div className="space-y-1">
                        <Image
                            data-test="event-image"
                            src={`/upload/${event.image}`}
                            width={400}
                            height={400}
                            // className="rounded-xl max-h-[96px] max-auto group-hover:opacity-80"

                            className="rounded-xl max-h-36 max-w-auto group-hover:opacity-80"
                            alt={event.title ?? "none"}
                            placeholder="blur"
                            blurDataURL={"product.imageBlur"}
                        />
                        <h2
                            data-test="event-title"
                            className="flex justify-start font-semibold text-sm text-gray-100"
                        >
                            {event.title}
                        </h2>
                        <p data-test="event-location" className="text-xs text-gray-300">
                            {eventAddress.province}, {eventAddress.country}
                        </p>
                        <EventDate date={event.date} collection={true} />
                    </div>
                </Link>
            ) : null}
        </>
    )
}
