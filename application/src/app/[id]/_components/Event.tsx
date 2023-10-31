import Image from "next/image"
import { Suspense } from "react"
import { EventInfo, InfoSkeleton } from "./EventInfo"
import { cookies } from "next/headers"
import ShowViper from "./ShowViper"
import OrganizerInfo from "./OrganizerInfo"
import { Event } from "@/types/event"
import { getCurrentViper } from "@/lib/session"
import { Session } from "next-auth"
import { preloadIsViperOnTheList } from "@/lib/events"
import { preloadViperBasicProps, preloadIsViperParticipationRequest } from "@/lib/vipers"
import { preloadIsCheckoutFulfilled } from "../../../helpers/isCheckoutFulFilled"
import { AddLike } from "./AddLike"
import AddComment from "./AddComment"
import { notFound } from "next/navigation"

export async function Event({ eventId }: { eventId: string }): Promise<JSX.Element> {
    const likedCookie: string = cookies().get("_is_liked")?.value || "none"
    const viperPromise: Promise<Session | null> = getCurrentViper()

    const eventPromise = fetch(`http://localhost:3000/api/event/${eventId}`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    })

    const [viperSession, selectedEventData] = await Promise.all([viperPromise, eventPromise])
    if (!viperSession) {
        // This will Render the closest Error.ts Error Boundary
        throw new Error(`No viper bro`)
    }
    if (!selectedEventData) {
        // Render the closest `not-found.js` Error Boundary
        notFound()
    }
    const selectedEvent: Event = await selectedEventData.json()

    if (!selectedEvent) return <div className="text-yellow-400 text-sm">Build up, from Event</div>
    const viperId: string = viperSession.user._id
    preloadViperBasicProps(selectedEvent.organizer._id)
    preloadIsViperOnTheList(eventId, viperId)
    preloadIsViperParticipationRequest(viperId, eventId)
    preloadIsCheckoutFulfilled(viperId, eventId)

    const selectedEventAddress = selectedEvent.location.address

    return (
        <div className="grid grid-cols-4 gap-6">
            <div className="col-span-full lg:col-span-1">
                <div className="space-y-2">
                    <Image
                        data-test="event-image"
                        alt={selectedEvent.title}
                        src={selectedEvent.image}
                        width={200}
                        height={200}
                        placeholder="blur"
                        blurDataURL={selectedEvent.image}
                        quality={100}
                        style={{
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                        // sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, 400px"
                        className="rounded-lg  lg:block "
                    />
                </div>
            </div>

            <div className="col-span-full space-y-4 lg:col-span-2">
                <div
                    data-test="event-title"
                    className="truncate text-xl font-medium text-white lg:text-2xl"
                >
                    {selectedEvent.title}
                </div>
                <div
                    data-test="event-content"
                    className="xl:text-sm lg:text-xs bg-gray-800/80 p-2 rounded-xl text-gray-100"
                >
                    {selectedEvent.content}
                </div>
                <div
                    data-test="event-address"
                    className="xl:text-xs lg:text-[14px] md:text-[12px] text-gray-200 flex justify-start"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="xl:w-[22px] xl:h-[22px] lg:w-[18px] lg:h-[18px] mr-1 text-red-500/80"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {selectedEventAddress.street}, {selectedEventAddress.postalCode},{" "}
                    {selectedEventAddress.province}, {selectedEventAddress.country}
                </div>
            </div>

            <div className="col-span-full md:col-span-1">
                {/* this component can be removed but i think is for the info suspense  */}
                <Suspense fallback={<InfoSkeleton />}>
                    {/* @ts-expect-error Async Server Component */}
                    <EventInfo
                        currentViper={viperSession!}
                        eventId={eventId}
                        eventDate={selectedEvent.date}
                        eventProvince={selectedEventAddress.province}
                        eventCountry={selectedEventAddress.country}
                        eventPrice={selectedEvent.price}
                        product={selectedEvent.product}
                        eventEntries={selectedEvent.entries}
                    />
                </Suspense>
            </div>
            <div className="mt-2 col-start-1 col-span-2 max-h-auto">
                <ShowViper viperName={selectedEvent.organizer.name} event={true} blog={true}>
                    <Suspense
                        fallback={
                            <div className="text-yellow-500 text-lg">suspense from event...</div>
                        }
                    >
                        {/* @ts-expect-error Async Server Component */}
                        <OrganizerInfo
                            key={selectedEvent.organizer._id}
                            organizerId={selectedEvent.organizer._id}
                            event={true}
                        />
                    </Suspense>
                </ShowViper>
            </div>
            <div className="text-gray-300 col-start-4">
                <AddLike
                    eventId={eventId}
                    commentId={JSON.stringify(selectedEvent._id)}
                    replyId={JSON.stringify(selectedEvent._id)}
                    likes={selectedEvent.likes.length}
                    timestamp={JSON.stringify(selectedEvent.creationDate)}
                    event={true}
                    reply={false}
                    blog={false}
                    likedCookie={likedCookie}
                />

                <AddComment
                    id={eventId}
                    commentId={JSON.stringify(selectedEvent._id)}
                    viperIdName={undefined}
                    commentReplies={selectedEvent.comments.length}
                    timestamp={null}
                    commentCookie={"none"}
                    event={true}
                    reply={false}
                    blog={false}
                />
            </div>
        </div>
    )
}
