// We will NOT use this service, instead we will be using the Repository Pattern under /repositories
import { Event } from "@/types/event"
import { Chats, Viper } from "@/types/viper"
import clientPromise from "@/utils/mongodb"
import { Collection, MongoClient, ObjectId } from "mongodb"
// delete file when migration is done
type DataBaseCollections = {
    viperCollection: Collection<Viper>
    eventCollection: Collection<Event>
    chatCollection: Collection<Chats>
}
export class DatabaseService {
    private viperCollection: Collection<Viper>
    private eventCollection: Collection<Event>
    private chatCollection: Collection<Chats>
    private constructor({
        viperCollection,
        eventCollection,
        chatCollection,
    }: DataBaseCollections) {
        this.viperCollection = viperCollection
        this.eventCollection = eventCollection
        this.chatCollection = chatCollection
    }
    static async init(): Promise<DatabaseService> {
        const client: MongoClient = await clientPromise
        const db = client.db("viperDb")
        const viperCollection: Collection<Viper> = db.collection<Viper>("users")
        const eventCollection: Collection<Event> = db.collection<Event>("events")
        const chatCollection: Collection<Chats> = db.collection<Chats>("chats")
        return new DatabaseService({ viperCollection, eventCollection, chatCollection })
    }
    getViperCollection(): Collection<Viper> {
        return this.viperCollection
    }
    getEventCollection(): Collection<Event> {
        return this.eventCollection
    }
    getChatCollection(): Collection<Chats> {
        return this.chatCollection
    }
    createObjectId(id: string): ObjectId {
        return new ObjectId(id)
    }
}
