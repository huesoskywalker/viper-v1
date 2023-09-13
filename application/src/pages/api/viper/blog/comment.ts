import { NextApiRequest, NextApiResponse } from "next"
import { Viper } from "@/types/viper"
import { commentBlog } from "@/lib/vipers"
import { ModifyResult } from "mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const blogOwnerId: string = body.blogOwner._id
    const commentId: string = body.comment._id
    const viperId: string = body.viper._id
    const comment: string = body.comment.content
    if (req.method === "POST") {
        try {
            const newComment: ModifyResult<Viper> = await commentBlog(
                blogOwnerId,
                commentId,
                viperId,
                comment
            )
            return res.status(200).json(newComment)
        } catch (error) {
            console.error(error)
        }
    }
}
