import { NextApiRequest, NextApiResponse } from "next"
import { DeleteResult, InsertOneResult, ModifyResult, ObjectId } from "mongodb"
import { Event, Location, Organizer, Product } from "@/types/event"
import { Viper } from "@/types/viper"
import { createEvent, deleteEvent, updateEvent } from "@/lib/events"
import { addOrganizedEvent, deleteOrganizedEvent } from "@/lib/vipers"
import { updateEventSchema } from "@/lib/zodSchemas/event/updateEventSchema"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    // Gotta add | Unions and ModifyResult is deprecated
    // res: NextApiResponse<InsertOneResult<Event>>
) {
    const body = req.body

    const title: string = body.title
    const content: string = body.content
    // this is before the react hook form, modify also the const event
    const date: string = body.date
    const time: string = body.time
    // this is after the react hook form modification
    // const date: string = body.date
    const category: string = body.category
    const price: number = body.price

    if (req.method === "POST") {
        const organizer: Organizer = body.organizer

        const location: Location = body.location
        const entries: number = body.entries
        const image: string = body.image
        const product: Product = body.product

        const event: Event = {
            _id: new ObjectId(),
            organizer: organizer,
            title: title,
            content: content,
            location: location,
            // date: date,
            date: `${date}T${time}.000Z`,
            category: category,
            creationDate: Date.now(),
            price: price,
            entries: entries,
            image: image,
            participants: [],
            updatedDate: Date.now(),
            likes: [],
            comments: [],
            product: product,
        }
        try {
            const eventAdded: InsertOneResult<Event> = await createEvent(event)

            const viperOrganizedEvent: ModifyResult<Viper> = await addOrganizedEvent(
                organizer._id,
                eventAdded.insertedId as string
            )

            return res.status(200).json([eventAdded, viperOrganizedEvent])
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    if (req.method === "PUT") {
        try {
            const updateEventProps = updateEventSchema.safeParse(body)
            if (updateEventProps.success) {
                const editedEvent: ModifyResult<Event> = await updateEvent(updateEventProps.data)
                return res.status(200).json(editedEvent)
            } else {
                let zodErrors = {}
                updateEventProps.error.issues.forEach((issue) => {
                    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
                })
                return res.status(400).json({ errors: zodErrors })
            }
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            })
        }
    }
    if (req.method === "DELETE") {
        // If crash on delete, it is because the declares declares outside are not requested on the body
        const eventId: string = body.eventId
        const eventImage: string = body.image
        try {
            const deletedEvent: DeleteResult = await deleteEvent(eventId, eventImage)

            const viperId: string = body.eventOrganizerId
            const deleteViperEventOrganized = await deleteOrganizedEvent(viperId, eventId)

            return res.status(200).json([deletedEvent, deleteViperEventOrganized])
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    return res.status(400)
}
