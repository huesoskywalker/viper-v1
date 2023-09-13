import { ModifyResult } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { UpdateViperType, Viper } from "@/types/viper"
import { updateViperProfile } from "@/lib/vipers"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body

    const viper: UpdateViperType = body.viper

    if (req.method === "PUT") {
        try {
            const updatedProfile: ModifyResult<Viper> = await updateViperProfile(viper)

            return res.status(200).json(updatedProfile)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
