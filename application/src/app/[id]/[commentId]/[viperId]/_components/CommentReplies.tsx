import { Reply } from "@/types/event"
import { getViperBasicProps } from "@/lib/vipers"
import { delay } from "@/app/[id]/_lib/delay"
import { ViperBasicProps } from "@/types/viper"
import { EventCommentsCard } from "@/app/[id]/_components/EventCommentsCard"

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
    const viperPromise: Promise<Response> = fetch(`/api/viper/${viperId}?props=basic-props`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    })
    const [replies, viperData] = await Promise.all([repliesPromise, viperPromise])

    if (!replies) throw new Error("No event bro")
    const viper: ViperBasicProps = await viperData.json()
    await delay(300)
    return (
        <ul>
            {replies.map((reply: Reply) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <EventCommentsCard
                        key={JSON.stringify(reply._id)}
                        eventId={eventId}
                        replyTo={viper.name}
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
