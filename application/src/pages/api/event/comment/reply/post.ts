import { NextApiRequest, NextApiResponse } from "next"
import { addReplyToComment } from "@/lib/events"
import { ModifyResult } from "mongodb"
import { Event } from "@/types/event"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const eventId: string = body.event._id
    const viperId: string = body.viper._id
    const commentId: string = body.comment._id
    const comment: string = body.comment.content
    if (req.method === "POST") {
        try {
            const commentTheComment: ModifyResult<Event> = await addReplyToComment(
                eventId,
                commentId,
                viperId,
                comment
            )
            return res.status(200).json(commentTheComment)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
