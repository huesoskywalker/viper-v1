import { Comment } from "@/types/event"
import { EventCommentsCard } from "./EventCommentsCard"

export async function EventComments({ eventId }: { eventId: string }) {
    const response = await fetch(`http://localhost:3000/api/event/comment/${eventId}`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    })
    const eventComments: Array<Comment> = await response.json()
    // const { data: eventComments } = await axios.get<Array<{
    //     title: string
    //     comment: Comment
    // }> | null>(`http://localhost:3000/api/event/comment/${eventId}`)
    if (!eventComments) throw new Error("No comments bro")
    return (
        <ul>
            {eventComments.map((comment) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <EventCommentsCard
                        key={JSON.stringify(comment.viperId)}
                        eventId={eventId}
                        // replyTo={title}
                        replyTo={"Let's Funk it UP !"}
                        commentId={JSON.stringify(comment._id)}
                        viperId={JSON.stringify(comment.viperId)}
                        text={comment.text}
                        commentLikes={comment.likes.length}
                        commentReplies={comment.replies.length}
                        replyId={undefined}
                        timestamp={comment.timestamp}
                        reply={false}
                    />
                )
            })}
        </ul>
    )
}
