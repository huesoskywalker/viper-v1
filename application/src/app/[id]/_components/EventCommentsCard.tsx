import { getViperBasicProps } from "@/lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import Link from "next/link"
import OrganizerInfo from "./OrganizerInfo"
import ShowViper from "./ShowViper"
import { delay } from "../_lib/delay"
import { EventDate } from "./EventDate"
import { ViperBasicProps } from "@/types/viper"
import AddComment from "./AddComment"
import { AddLike } from "./AddLike"

export async function EventCommentsCard({
    eventId,
    replyTo,
    commentId,
    viperId,
    text,
    commentLikes,
    commentReplies,
    replyId,
    timestamp,
    reply,
}: {
    eventId: string
    replyTo: string | undefined
    commentId: string
    viperId: string
    text: string
    commentLikes: number
    commentReplies: number
    replyId: string | undefined
    timestamp: number
    reply: boolean
}) {
    const viper_id: string = viperId.replace(/['"]+/g, "")
    const comment_id: string = commentId.replace(/['"]+/g, "")
    const response = await fetch(`/api/viper/${viper_id}?props=basic-props`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    })
    const viper: ViperBasicProps = await response.json()

    if (!viper) throw new Error("No viper bro")
    const likedCookie = cookies().get(`_${reply ? replyId : comment_id}_is_liked`)?.value || "none"

    await delay(1000)
    return (
        <div
            data-test="event-comment-card"
            className=" space-y-2 lg:border-b lg:border-gray-800 pb-3 ml-5"
        >
            <div className="flex items-center w-full max-w-lg  mx-auto ">
                <div className=" text-center sm:ml-4 sm:text-left">
                    <div className="grid grid-cols-9 gap-3 space-x-4">
                        <div className="col-start-1 col-span-1 ">
                            <Link href={`/dashboard/vipers/${viper_id}`}>
                                <Image
                                    data-test="viper-image"
                                    src={`/vipers/${viper.image}`}
                                    alt={`/vipers/${viper.image}`}
                                    width={50}
                                    height={50}
                                    className="rounded-full "
                                />
                            </Link>
                        </div>
                        <div className="col-start-2 col-span-7 border-[1px] border-slate-600 rounded-xl bg-gray-700/50 p-[6px] h-[7rem] w-[22rem]  space-y-2">
                            <div className="flex justify-between  max-h-auto">
                                <ShowViper viperName={viper.name} event={false} blog={false}>
                                    {/* tests not done in Organizer Info */}
                                    {/* @ts-expect-error Async Server Component */}
                                    <OrganizerInfo
                                        key={JSON.stringify(viper._id)}
                                        organizerId={JSON.stringify(viper._id)}
                                        event={true}
                                    />
                                </ShowViper>
                                <EventDate date={timestamp} collection={false} />
                            </div>

                            <Link
                                // add data test from here and all below
                                href={`/${eventId}/${comment_id}/${viper_id}`}
                                className="space-y-2"
                            >
                                {!reply ? (
                                    <span className="text-gray-400/70 text-xs flex align-top">
                                        Commenting on{" "}
                                        <span
                                            data-test="comment-on"
                                            className="text-blue-500/80 text-xs ml-[5px]"
                                        >
                                            {" "}
                                            {replyTo}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-gray-400/70 text-xs flex align-top">
                                        Replying to{" "}
                                        <span className="text-blue-500/80 text-xs ml-[5px]">
                                            {replyTo}
                                        </span>
                                    </span>
                                )}
                                <span
                                    data-test="event-comment"
                                    className="flex justify-start text-gray-300 text-xs mx-2  "
                                >
                                    {text}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center -ml-44 space-x-4 space-y-1 ">
                <AddLike
                    eventId={eventId}
                    commentId={comment_id}
                    replyId={replyId}
                    likes={commentLikes}
                    timestamp={0}
                    event={false}
                    reply={reply}
                    blog={false}
                    likedCookie={likedCookie}
                />
                {!reply ? (
                    <AddComment
                        id={eventId}
                        commentId={comment_id}
                        viperIdName={undefined}
                        commentReplies={commentReplies}
                        timestamp={null}
                        commentCookie={"none"}
                        event={false}
                        reply={reply}
                        blog={false}
                    />
                ) : null}
            </div>
        </div>
    )
}
