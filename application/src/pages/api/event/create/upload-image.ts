import { EventUploadImage } from "@/types/event"
import { Fields, Files, File } from "formidable"
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

export default async function uploadFormFiles(
    req: NextApiRequest,
    res: NextApiResponse<EventUploadImage>
) {
    const form: IncomingForm = new IncomingForm({
        multiples: false,
        keepExtensions: true,
    })
    if (req.method === "POST") {
        try {
            // const formParse = promisify(form.parse.bind(form))
            // const { fields, files }: { fields: Fields; files: Files } = await formParse(req)
            form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
                if (err && err instanceof errors.FormidableError) {
                    return res.status(400).json({
                        data: null,
                        error: `code: ${err.internalCode}, httpCode: ${err.httpCode}, ${err.name}: ${err.message}`,
                    })
                }
                if (!files.file) {
                    return res.status(400).json({ data: null, error: "No file provided " })
                }
                const file: File = files.file[0] as File
                const validTypes: Array<string> = ["image/jpeg", "image/png", "image/webp"]

                if (
                    (file.mimetype && !validTypes.includes(file.mimetype)) ||
                    file.mimetype === null
                ) {
                    return res.status(400).json({ data: null, error: "Invalid file type" })
                }

                const outPath: string = path.join(
                    "public",
                    "uploads",
                    "events",
                    `${file.newFilename}`
                )
                try {
                    await sharp(file.filepath)
                        .resize({
                            height: 240,
                            width: 240,
                        })
                        .jpeg({ quality: 80 })
                        .toFile(outPath)

                    const imageUrl: string = `/uploads/events/${file.newFilename}`
                    // this name is for shopify I guess
                    const imageName: string | null = file.originalFilename
                    // Check in here since we are uploading everything as jpeg in sharp
                    // But this is for Shopify If i am not wrong
                    const imageType: string = file.mimetype
                    const imageSize: string = file.size.toString()
                    return res.status(200).json({
                        data: {
                            url: imageUrl,
                            filename: imageName,
                            type: imageType,
                            size: imageSize,
                        },
                        error: null,
                    })
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return res
                            .status(400)
                            .json({ data: null, error: `${error.name}: ${error.message}` })
                    } else {
                        return res
                            .status(500)
                            .json({ data: null, error: "An unexpected error occurred" })
                    }
                }
            })
        } catch (error) {
            return res.status(500).json({ data: null, error: "An unexpected error occurred" })
        }
    } else if (req.method === "PUT") {
        // To update the event Image
    }
}
// const form = new Formidable({
//     multiples: false,
//     keepExtensions: true,
// })
// form.on("file", (name: string, file: File) => {
//     const data = fs.readFileSync(file.filepath)
//     file.filepath = file.newFilename
//     fs.writeFileSync(`public/upload/${file.newFilename}`, data)
//     let url: string = file.filepath
//     let filename: string | null = file.originalFilename
//     let type: string | null = file.mimetype
//     let size: string = file.size.toString()
//     return res.status(200).json({
//         data: {
//             url,
//             filename,
//             type,
//             size,
//         },
//         error: null,
//     })
// })
//     .on("aborted", () => {
//         reject(res.status(500))
//     })
//     .on("end", () => {
//         resolve(res.status(200))
//     })
// form.parse(req)
