import { Comment } from "@/types/event"
import { EventCommentsCard } from "./EventCommentsCard"
import axios from "axios"

export async function EventComments({ eventId }: { eventId: string }) {
    const { data: eventComments } = await axios.get<Array<{
        title: string
        comment: Comment
    }> | null>(`http://localhost:3000/api/event/comment/${eventId}`)
    if (!eventComments) throw new Error("No comments bro")
    return (
        <ul>
            {eventComments.map((commentsData: { title: string; comment: Comment }) => {
                const { title, comment } = commentsData
                return (
                    /* @ts-expect-error Async Server Component */
                    <EventCommentsCard
                        key={JSON.stringify(comment.viperId)}
                        eventId={eventId}
                        replyTo={title}
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
