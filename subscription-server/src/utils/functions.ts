import { ObjectId } from "mongodb"
import { Chats, Viper, ViperBasicProps } from "../types/viper"
import clientPromise from "../lib/mongodb"

export const getViperBasicProps = async (viperId: string): Promise<ViperBasicProps> => {
    const client = await clientPromise
    const db = client.db("viperDb")
    const viperCollection = db.collection<Viper>("users")
    try {
        const viper = await viperCollection.findOne<Viper | null>(
            {
                _id: new ObjectId(viperId),
            },
            {
                projection: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    backgroundImage: 1,
                    email: 1,
                    location: 1,
                    biography: 1,
                    followers: 1,
                    follows: 1,
                },
            }
        )
        if (!viper) throw new Error(`Bad viper id request`)
        return viper
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export async function sendViperMessage(viperId: string, contactId: string, message: string) {
    const client = await clientPromise
    const db = client.db("viperDb")
    const chatCollection = db.collection<Chats>("chats")
    const newMessage = await chatCollection.findOneAndUpdate(
        {
            $or: [
                {
                    members: [new ObjectId(viperId), new ObjectId(contactId)],
                },
                {
                    members: [new ObjectId(contactId), new ObjectId(viperId)],
                },
            ],
        },
        {
            $push: {
                messages: {
                    _id: new ObjectId(),
                    sender: new ObjectId(viperId),
                    message: message,
                    timestamp: Date.now(),
                },
            },
        },
        { returnDocument: "after" }
    )
    // return newMessage.value!
    return newMessage.value?.messages[newMessage.value.messages.length - 1]
}

export async function getVipersMessenger(id: string, viperId: string): Promise<Chats | null> {
    const client = await clientPromise
    const db = client.db("viperDb")
    const chatCollection = db.collection<Chats>("chats")
    const vipersMessenger: Chats | null = await chatCollection.findOne<Chats>({
        members: {
            $in: [
                [new ObjectId(id), new ObjectId(viperId)],
                [new ObjectId(viperId), new ObjectId(id)],
            ],
        },
    })

    return vipersMessenger
}
