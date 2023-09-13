import { Event, IEventRepository } from "@/types/event"
import { Collection, Db, ObjectId } from "mongodb"

export class EventRepository implements IEventRepository {
    private eventCollection: Collection<Event>
    constructor(database: Db) {
        this.eventCollection = database.collection<Event>("events")
    }
    async getById(eventId: string): Promise<Event | null> {
        const event = await this.eventCollection.findOne<Event>({
            _id: new ObjectId(eventId),
        })
        return event
    }
}
