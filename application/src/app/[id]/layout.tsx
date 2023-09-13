import { PageProps } from "../../lib/utils"
import GoBackArrow from "./_components/GoBackArrow"
import { Event } from "./_components/Event"
import { preloadEventById } from "../../lib/events"
import { Suspense } from "react"
import { preloadViperSession } from "../../lib/session"
export default async function Layout({ children, params }: PageProps) {
    const eventId: string = params.id
    preloadEventById(eventId)
    preloadViperSession()
    return (
        <div className="flex justify-center space-x-2 mr-5">
            <GoBackArrow />
            <div className="mx-5 lg:border-x lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                <div className="m-5 max-h-[100%] border-b-[1px] pb-3 border-gray-700/80">
                    {/* <Suspense
                        fallback={
                            <div className="text-yellow-500 text-lg">Suspense from Layout...</div>
                        }
                    > */}
                    {/* @ts-expect-error Server Component */}
                    <Event eventId={eventId} />
                    {/* </Suspense> */}
                </div>
                {children}
            </div>
        </div>
    )
}
