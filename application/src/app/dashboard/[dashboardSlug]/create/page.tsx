import { getCurrentViper } from "@/lib/session"
import { Suspense } from "react"
import Loading from "./loading"
import { Session } from "next-auth"
import { Viper } from "@/types/viper"
import { preloadEventById } from "@/lib/events"
import PreviewEventButton from "./_components/PreviewEventButton"
import { Event } from "@/app/[id]/_components/Event"

export default async function CreateEventPage() {
    const session: Session | null = await getCurrentViper()
    if (!session) throw new Error("No Viper bro")
    const viperSession = session?.user
    const fetchViper = await fetch(`http://localhost:3000/api/viper/${viperSession._id}`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        cache: "no-cache",
    })
    const viper: Viper = await fetchViper.json()
    const lastEventCreated = viper.myEvents?.created.pop()
    if (!lastEventCreated?._id)
        return (
            <div>
                <span className="text-gray-400 text-xs flex justify-start align-baseline">
                    You have not created any event yet. Go ahead for the vipers.
                </span>
            </div>
        )
    const lastEventId = JSON.stringify(lastEventCreated._id).replace(/['"]+/g, "")
    preloadEventById(lastEventId)
    return (
        <div className="flex justify-start">
            <Suspense fallback={<Loading />}>
                <PreviewEventButton>
                    <div>
                        <span className="text-gray-400 text-xs flex justify-start align-baseline">
                            The last event you created
                        </span>
                        {/* WITH THE EDIT EVENT WE CAN MAKE A RELATIVE/FLOATING BUTTON OVER THE IMAGE */}
                        {/* Cuz we cannot get the _id of the event to edit */}
                        {/* <EditEvent
                            href={`/dashboard/myevents/${lastEventId}`}
                        /> */}
                        {/* @ts-expect-error Async Server Component */}
                        <Event eventId={lastEventCreated._id} />
                    </div>
                </PreviewEventButton>
            </Suspense>
        </div>
    )
}
