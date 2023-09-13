import { NextApiRequest, NextApiResponse } from "next"
import { likeBlog } from "@/lib/vipers"
import { ModifyResult, MongoError } from "mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const blogOwnerId: string = body.blogOwner._id
    const commentId: string = body.comment._id
    const viperId: string = body.viper._id

    try {
        // Recheck in this functions if we can split the functions since this one are too large and may be complicated
        const [viperBlogUpdate, likeBlogUpdate]: [ModifyResult<Viper>, ModifyResult<Viper>] =
            await likeBlog(blogOwnerId, commentId, viperId)
        return res.status(200).json([viperBlogUpdate, likeBlogUpdate])
    } catch (error: unknown) {
        if (error instanceof MongoError) {
            return res.status(400).json({ error: `${error.name}: ${error.message}` })
        }
    }
}
