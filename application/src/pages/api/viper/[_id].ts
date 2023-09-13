import { NextApiRequest, NextApiResponse } from "next"
import { getViperBasicProps, getViperById } from "@/lib/vipers"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { _id },
    } = req

    try {
        if (!Array.isArray(_id) && _id) {
            if (req.query.props === "basic-props") {
                const basicViper = await getViperBasicProps(_id)
                if (!basicViper) {
                    return res.status(404).json({ message: "Viper not found" })
                }
                return res.status(200).json(basicViper)
            } else {
                const viper: Viper | null = await getViperById(_id)
                if (!viper) {
                    return res.status(404).json({ message: "Viper not found" })
                }
                return res.status(200).json(viper)
            }
        }
    } catch (error) {
        return res.status(400).json({ message: "Internal Server Error" })
    }
}
