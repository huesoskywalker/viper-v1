import { UploadViperImage } from "@/types/viper"
import { Fields, File, Files } from "formidable"
import IncomingForm from "formidable/Formidable"
import errors from "formidable/FormidableError"
import type { NextApiRequest, NextApiResponse } from "next"
import path from "path"
import sharp from "sharp"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function uploadBackgroundImage(
    req: NextApiRequest,
    res: NextApiResponse<UploadViperImage>
) {
    const form = new IncomingForm({
        multiples: false,
        keepExtensions: true,
    })

    try {
        form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
            if (err && err instanceof errors.FormidableError) {
                return res.status(400).json({
                    data: null,
                    error: `code ${err.internalCode}, httCode: ${err.httpCode}, ${err.name}, ${err.message} `,
                })
            }
            if (!files.file) {
                return res.status(400).json({ data: null, error: "No file provided" })
            }

            const file: File = files.file[0] as File
            const validTypes: Array<string> = ["image/jpeg", "image/png", "image/webp"]

            if ((file.mimetype && !validTypes.includes(file.mimetype)) || file.mimetype === null) {
                return res.status(400).json({ data: null, error: "Invalid file type" })
            }
            const outPath: string = path.join(
                "public",
                "uploads",
                "vipers",
                "background",
                `${file.newFilename}`
            )
            try {
                await sharp(file.filepath)
                    .resize({
                        height: 710,
                        width: 570,
                    })
                    .jpeg({ quality: 80 })
                    .toFile(outPath)

                const dataUrl: string = `/uploads/vipers/background/${file.newFilename}`
                return res.status(200).json({
                    data: { url: dataUrl },
                    error: null,
                })
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return res.status(400).json({
                        data: null,
                        error: `${error.name}: ${error.message}`,
                    })
                } else {
                    return res.status(500).json({
                        data: null,
                        error: `An unexpected error occurred, ${error} `,
                    })
                }
            }
        })
    } catch (error: unknown) {
        return res.status(500).json({
            data: null,
            error: `An unexpected error occurred, ${error}`,
        })
    }
    // return new Promise(async (resolve, reject) => {
    //     const form = new Formidable({
    //         multiples: false,
    //         keepExtensions: true,
    //     })
    //     form.on("file", (name: string, file: File) => {
    //         const data = fs.readFileSync(file.filepath)
    //         file.filepath = file.newFilename
    //         fs.writeFileSync(`public/vipers/${file.newFilename}`, data)
    //         let url: string = file.filepath
    //         return res.status(200).json({
    //             bgData: {
    //                 url: url,
    //             },
    //             bgError: null,
    //         })
    //     })
    //         .on("aborted", () => {
    //             reject(res.status(500))
    //         })
    //         .on("end", () => {
    //             resolve(res.status(200))
    //         })

    //     form.parse(req)
    // })
}
