import { NextApiRequest, NextApiResponse } from "next"
import { addFollow } from "@/lib/vipers"
import { ModifyResult } from "mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const currentViperId: string = body.currentViper._id
    const viperId: string = body.viper._id

    if (req.method === "PUT") {
        try {
            // Recheck the code and split it in different functions so it gets more readable and maintainable
            const [follower, follows]: [ModifyResult<Viper>, ModifyResult<Viper>] =
                await addFollow(viperId, currentViperId)
            return res.status(200).json([follower, follows])
        } catch (error) {
            return res.status(400).json({ error: `${error}` })
        }
    }
}
