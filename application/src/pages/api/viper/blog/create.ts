import { ModifyResult, ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { Viper } from "@/types/viper"
import { createBlog } from "@/lib/vipers"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const viperId: string = body._id
    const comment: string = body.content

    if (req.method === "POST") {
        try {
            const blogContent: ModifyResult<Viper> = await createBlog(viperId, comment)
            return res.status(200).json(blogContent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
