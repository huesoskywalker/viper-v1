import { NextApiRequest, NextApiResponse } from "next"
import { isCommentReplyLiked, toggleLikeOnCommentReply } from "@/lib/events"
import { ModifyResult, MongoError } from "mongodb"
import { Event } from "@/types/event"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const eventId: string = body.event._id
    const commentId: string = body.comment._id
    const viperId: string = body.viper._id
    const replyId: string = body.replyId.replace(/["']+/g, "")
    if (req.method === "POST") {
        try {
            const isLiked: boolean = await isCommentReplyLiked(
                eventId,
                commentId,
                replyId,
                viperId
            )
            const operation: "$pull" | "$push" = isLiked ? "$pull" : "$push"
            const likeReply: ModifyResult<Event> = await toggleLikeOnCommentReply(
                eventId,
                commentId,
                replyId,
                viperId,
                operation
            )
            return res.status(200).json(likeReply)
        } catch (error: unknown) {
            if (error instanceof MongoError) {
                return res.status(400).json({
                    error: `${error.name}: ${error.message}`,
                })
            }
        }
    }
}
