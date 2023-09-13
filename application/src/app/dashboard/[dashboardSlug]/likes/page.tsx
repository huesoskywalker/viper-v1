import { getCurrentViper } from "@/lib/session"
import { preloadViperLikedEvents } from "@/lib/vipers"
import { Suspense } from "react"
import Loading from "./loading"
import ViperCollection from "../_components/ViperCollection"
import { redirect } from "next/navigation"

export default async function LikedPage() {
    const viperSession = await getCurrentViper()
    if (!viperSession) {
        // check this one
        // probably if loading should not redirect
        redirect(`/api/auth/signin`)
    }
    const viper = viperSession.user

    // const likedEvents: Promise<Likes[]> = getViperLikedEvents()
    // if (!likedEvents) return <div> asdf </div>
    preloadViperLikedEvents(viper._id)
    // const fetchEvents = await fetch(`http://localhost:3000/api/viper/event/likes`, {
    //     method: "GET",
    //     headers: {
    //         "content-type": "application/json; charset=utf-8",
    //     },
    // })
    // const likedEvents = fetchEvents.json()
    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <ViperCollection
                    // collectionPromise={likedEvents}
                    isCollection={false}
                    viperId={viper._id}
                />
            </Suspense>
        </div>
    )
}
