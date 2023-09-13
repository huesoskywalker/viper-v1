import { NextApiRequest, NextApiResponse } from "next"
import { addComment } from "@/lib/events"
import { ModifyResult } from "mongodb"
import { Event } from "@/types/event"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const eventId: string = body.event._id
    const viperId: string = body.viper._id
    const comment: string = body.comment

    if (body.comment !== "") {
        try {
            const newComment: ModifyResult<Event> = await addComment(eventId, viperId, comment)
            return res.status(200).json(newComment)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
