import { getViperBlogs } from "@/lib/vipers"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    console.log(`-------/api/viper/blog/all`)
    console.log(body.viper_id)
    try {
        const viperBlogs = await getViperBlogs(body.viper_id)
        return res.status(200).json(viperBlogs)
    } catch (error) {
        return res.status(400).json(error)
    }
}
