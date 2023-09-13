import { Reply } from "@/types/event"
import { getViperBasicProps } from "@/lib/vipers"
import { delay } from "@/app/[id]/_lib/delay"
import { ViperBasicProps } from "@/types/viper"
import { EventCommentsCard } from "@/app/[id]/_components/EventCommentsCard"
import axios, { AxiosResponse } from "axios"

export async function CommentReplies({
    repliesPromise,
    eventId,
    commentId,
    viperId,
}: {
    repliesPromise: Promise<Reply[] | null>
    eventId: string
    commentId: string
    viperId: string
}) {
    // const commentViperData: Promise<ViperBasicProps | null> = getViperBasicProps(viperId)

    const commentViperPromise: Promise<AxiosResponse<ViperBasicProps>> =
        axios.get<ViperBasicProps>(`/api/viper/${viperId}?props=basic-props`)
    const [replies, commentViper] = await Promise.all([repliesPromise, commentViperPromise])

    if (!replies) throw new Error("No event bro")
    const commentViperData = commentViper.data
    await delay(300)
    return (
        <ul>
            {replies.map((reply: Reply) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <EventCommentsCard
                        key={JSON.stringify(reply._id)}
                        eventId={eventId}
                        replyTo={commentViperData.name}
                        commentId={commentId}
                        viperId={JSON.stringify(reply.viperId)}
                        text={reply.reply}
                        commentLikes={reply.likes.length}
                        replyId={JSON.stringify(reply._id).replace(/["']+/g, "")}
                        timestamp={reply.timestamp}
                        reply={true}
                    />
                )
            })}
        </ul>
    )
}
