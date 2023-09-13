import { getViperCreatedEvents } from "@/lib/vipers"
import { Event } from "@/types/event"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    try {
        const allViperEvents: Event[] | undefined = await getViperCreatedEvents(body.viperId)
        return res.status(200).json(allViperEvents)
    } catch (error) {
        return res.status(400).json(error)
    }
}
