import { NextApiRequest, NextApiResponse } from "next"
import { isEventLiked, toggleEventLike } from "@/lib/events"
import { toggleLikeEvent } from "@/lib/vipers"
import { ModifyResult, MongoError } from "mongodb"
import { Event } from "@/types/event"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const eventId: string = body.event._id
    const viperId: string = body.viper._id

    const isLiked: boolean = await isEventLiked(eventId, viperId)
    const operation = isLiked ? "$pull" : "$push"

    try {
        const likeEvent: ModifyResult<Event> = await toggleEventLike(eventId, viperId, operation)

        const viperLikeEvent: ModifyResult<Viper> = await toggleLikeEvent(
            viperId,
            eventId,
            operation
        )

        return res.status(200).json([likeEvent, viperLikeEvent])
    } catch (error: unknown) {
        if (error instanceof MongoError) {
            return res.status(400).json({
                error: `${error.name}: ${error.message}`,
            })
        }
    }
}
