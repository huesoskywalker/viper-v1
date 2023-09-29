import { Event, IEventRepository } from "@/types/event"
import { Collection, Db, ObjectId } from "mongodb"

export class EventRepository implements IEventRepository {
    private eventCollection: Collection<Event>
    constructor(database: Db) {
        this.eventCollection = database.collection<Event>("events")
    }
    async getAll(): Promise<Event[]> {
        const events: Event[] = await this.eventCollection
            .aggregate<Event>([
                {
                    $sort: { date: 1 },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        location: 1,
                        date: 1,
                        category: 1,
                        image: 1,
                    },
                },
            ])
            .limit(20)
            .toArray()

        return events
    }
    async getById(eventId: string): Promise<Event | null> {
        const event = await this.eventCollection.findOne<Event>({
            _id: new ObjectId(eventId),
        })
        return event
    }
    async getByCategory(category: string): Promise<Event[]> {}
}
