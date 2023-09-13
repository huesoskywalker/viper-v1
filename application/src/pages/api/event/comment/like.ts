import { NextApiRequest, NextApiResponse } from "next"
import { isCommentLiked, toggleLikeOnComment } from "@/lib/events"
import { ModifyResult, MongoError } from "mongodb"
import { Event } from "@/types/event"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const eventId: string = body.event._id
    const commentId: string = body.comment._id
    const viperId: string = body.viper._id

    if (req.method === "POST") {
        const isLiked: boolean = await isCommentLiked(eventId, commentId, viperId)
        const operation = isLiked ? "$pull" : "$push"
        try {
            const toggleLikeResult: ModifyResult<Event> = await toggleLikeOnComment(
                eventId,
                commentId,
                viperId,
                operation
            )
            return res.status(200).json(toggleLikeResult)
        } catch (error: unknown) {
            if (error instanceof MongoError) {
                return res.status(400).json({
                    error: `${error.name}: ${error.message}`,
                })
            }
        }
    }
}
