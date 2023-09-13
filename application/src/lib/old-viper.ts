import { ObjectId } from "mongodb"
import {
    Viper,
    Collection,
    Follow,
    Blog,
    Likes,
    ExternalBlog,
    Chats,
    ViperBasicProps,
} from "@/types/viper"
import { getCurrentViper } from "./session"
import { Session } from "next-auth"
import { Event } from "@/types/event"
import { DatabaseService } from "@/services/databaseService"

const dataBase = await DatabaseService.init()
const viperCollection = dataBase.getViperCollection()

{
    /**
     * Using this to Test with Cypress, sign in Credentials
     */
}
// export const getViperByUsername = async (username: string, password: string) => {
//     try {
//         const viper = await viperCollection.findOne<Viper>({
//             name: username,
//         })
//         return viper
//     } catch (error) {
//         throw new Error(`${error}`)
//     }
// }

export const getViperByUsername = async (username: string): Promise<Viper[] | null> => {
    try {
        await dataBase.getViperCollection().createIndexes([
            {
                name: "someNewIndex",
                key: { name: "text" },
            },
        ])

        // await viperCollection.createIndex({
        //     title: "text",
        // })
        const viper: Viper[] = await dataBase
            .getViperCollection()
            .find({
                $text: {
                    $search: username,
                },
            })
            .toArray()

        return viper
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const preloadViperById = (viperId: string | ObjectId): void => {
    void getViperById(viperId)
}
export const getViperById = async (viperId: string | ObjectId): Promise<Viper | null> => {
    if (typeof viperId === "object") return null
    const viper = await dataBase.getViperCollection().findOne<Viper>({
        _id: dataBase.createObjectId(viperId),
    })
    // if (!viper) return undefined
    return viper
}

export const preloadViperBasicProps = (viperId: string): void => {
    void getViperBasicProps(viperId)
}
export const getViperBasicProps = async (viperId: string): Promise<ViperBasicProps | null> => {
    // if (typeof viperId === "object") return null
    try {
        const viper = await dataBase.getViperCollection().findOne<Viper | null>(
            {
                _id: dataBase.createObjectId(viperId),
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

export async function getVipers(): Promise<Viper[]> {
    const vipers = await dataBase.getViperCollection().find<Viper>({}).toArray()
    if (!vipers) throw new Error("No vipers")
    return vipers
}
export const preloadViperCollectionEvents = (viperId: string): void => {
    void getViperCollectionEvents(viperId)
}
export const getViperCollectionEvents = async (viperId: string): Promise<Collection[]> => {
    const events = await dataBase
        .getViperCollection()
        .aggregate<Collection>([
            {
                $match: { _id: dataBase.createObjectId(viperId) },
            },
            {
                $unwind: "$myEvents.collection",
            },
            {
                $project: {
                    _id: "$myEvents.collection._id",
                    checkoutId: "$myEvents.collection.checkoutId",
                },
            },
        ])
        .toArray()

    return events
}

// This will be in the api endpoint
export const preloadViperLikedEvents = (viperId: string): void => {
    void getViperLikedEvents(viperId)
}
export async function getViperLikedEvents(viperId: string): Promise<Likes[]> {
    // const viper: Session | null = await getCurrentViper()
    // const viper_id: string | undefined = viper?.user._id
    const likedEvents = await dataBase
        .getViperCollection()
        .aggregate<Likes>([
            {
                $match: { _id: dataBase.createObjectId(viperId) },
            },
            {
                $unwind: "$myEvents.likes",
            },
            {
                $project: {
                    _id: "$myEvents.likes._id",
                },
            },
        ])
        .toArray()
    return likedEvents
}

export async function getViperFollows(id: string): Promise<Follow[]> {
    const viperFollows = await dataBase
        .getViperCollection()
        .aggregate<Follow>([
            {
                $match: { _id: dataBase.createObjectId(id) },
            },
            {
                $unwind: "$follows",
            },
            {
                $project: {
                    _id: "$follows._id",
                },
            },
        ])
        .toArray()
    return viperFollows
}
// We are not using this function, YET! we have modified the to implement Apollo
// export async function initVipersChat(viperId: string, contactId: string) {
//     const initChat = await dataBase.getChatCollection().findOneAndUpdate(
//         {
//             $or: [
//                 {
//                     members: [
//                         dataBase.createObjectId(viperId),
//                         dataBase.createObjectId(contactId),
//                     ],
//                 },
//                 {
//                     members: [
//                         dataBase.createObjectId(contactId),
//                         dataBase.createObjectId(viperId),
//                     ],
//                 },
//             ],
//         },
//         {
//             $setOnInsert: {
//                 members: [dataBase.createObjectId(viperId), dataBase.createObjectId(contactId)],
//                 messages: [],
//             },
//         },
//         { upsert: true }
//     )
//     return initChat
// }

// export async function sendViperMessage(viperId: string, contactId: string, message: string) {
//     const newMessage = await dataBase.getChatCollection().findOneAndUpdate(
//         {
//             $or: [
//                 {
//                     members: [
//                         dataBase.createObjectId(viperId),
//                         dataBase.createObjectId(contactId),
//                     ],
//                 },
//                 {
//                     members: [
//                         dataBase.createObjectId(contactId),
//                         dataBase.createObjectId(viperId),
//                     ],
//                 },
//             ],
//         },
//         {
//             $push: {
//                 messages: {
//                     _id: new ObjectId(),
//                     sender: dataBase.createObjectId(viperId),
//                     message: message,
//                     timestamp: Date.now(),
//                 },
//             },
//         },
//         { returnDocument: "after" }
//     )
//     // return newMessage.value!
//     return newMessage.value?.messages[newMessage.value.messages.length - 1]
// }

// export async function getVipersMessenger(id: string, viperId: string): Promise<Chats | null> {
//     const vipersMessenger: Chats | null = await dataBase.getChatCollection().findOne<Chats>({
//         members: {
//             $in: [
//                 [dataBase.createObjectId(id), dataBase.createObjectId(viperId)],
//                 [dataBase.createObjectId(viperId), dataBase.createObjectId(id)],
//             ],
//         },
//     })

//     return vipersMessenger
// }

// Gotta fix this, and make it way much prettier, thanks
// export async function getBlogLikesAndRePosts(id: string): Promise<ExternalBlog[]> {
//     const viperBlog = await dataBase
//         .getViperCollection()
//         .aggregate<ExternalBlog>([
//             {
//                 $match: {
//                     _id: dataBase.createObjectId(id),
//                 },
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     blogLikesAndRePosts: {
//                         $concatArrays: ["$blogLikes", "$blogRePosts", "$blogCommented"],
//                     },
//                 },
//             },
//             {
//                 $unwind: "$blogLikesAndRePosts",
//             },
//             {
//                 $project: {
//                     _id: "$blogLikesAndRePosts._id",
//                     blogOwner_id: "$blogLikesAndRePosts.blogOwner_id",
//                     viper_id: "$blogLikesAndRePosts.viper_id",
//                     timestamp: "$blogLikesAndRePosts.timestamp",
//                     comment: "$blogLikesAndRePosts.comment",
//                 },
//             },
//             {
//                 $sort: { timestamp: -1 },
//             },
//         ])
//         .toArray()
//     return viperBlog
// }

// ========================================================
// export const getBlog = async (_id: string, blogOwner_id: string): Promise<Blog[] | undefined> => {
//     // this looks horrible
//     const bId = _id.slice(1, -1)
//     const vId = blogOwner_id.slice(1, -1)
//     try {
//         const viperBlog = await dataBase
//             .getViperCollection()
//             .aggregate<Blog>([
//                 {
//                     $match: {
//                         _id: dataBase.createObjectId(vId),
//                         "blog._id": dataBase.createObjectId(bId),
//                     },
//                 },
//                 {
//                     $project: {
//                         blog: {
//                             $filter: {
//                                 input: "$blog",
//                                 as: "b",
//                                 cond: {
//                                     $eq: ["$$b._id", dataBase.createObjectId(bId)],
//                                 },
//                             },
//                         },
//                     },
//                 },
//                 {
//                     $unwind: "$blog",
//                 },
//                 {
//                     $project: {
//                         _id: "$blog._id",
//                         content: "$blog.content",
//                         likes: "$blog.likes",
//                         comments: "$blog.comments",
//                         timestamp: "$blog.timestamp",
//                         rePosts: "$blog.rePosts",
//                     },
//                 },
//             ])
//             .toArray()
//         return viperBlog
//     } catch (error) {
//         console.error(error)
//     }
// }

export const preloadViperFollowed = (viperId: string): void => {
    void getViperFollowById(viperId)
}
export const getViperFollowById = async (viperId: string): Promise<boolean> => {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    // if (viperId === currentViper?.id) return false

    const viperFollower = await dataBase.getViperCollection().findOne({
        _id: dataBase.createObjectId(viperId),
        "followers._id": dataBase.createObjectId(viperSession.user._id),
    })
    if (!viperFollower) return false
    return true
}

export const preloadRequestEventParticipation = (viperId: string, eventId: string): void => {
    void requestEventParticipation(viperId, eventId)
}
export async function requestEventParticipation(
    viperId: string,
    eventId: string
): Promise<boolean> {
    try {
        const request = await dataBase.getViperCollection().findOne({
            _id: dataBase.createObjectId(viperId),
            "myEvents.collection._id": dataBase.createObjectId(eventId),
        })

        if (!request) return false
        return true
    } catch (error) {
        throw new Error("Error en requestEventParticipation")
    }
}

export const preloadViperBlogs = (viperId: string): void => {
    void getViperBlogs(viperId)
}

export const getViperBlogs = async (viperId: string): Promise<Blog[]> => {
    try {
        const viperBlogs: Blog[] = await dataBase
            .getViperCollection()
            .aggregate<Blog>([
                {
                    $match: {
                        _id: dataBase.createObjectId(viperId),
                    },
                },
                {
                    $unwind: "$blog",
                },
                { $unwind: "$blog.myBlog" },
                {
                    $project: {
                        _id: "$blog.myBlog._id",
                        content: "$blog.myBlog.content",
                        likes: "$blog.myBlog.likes",
                        comments: "$blog.myBlog.comments",
                        rePosts: "$blog.myBlog.rePosts",
                        timestamp: "$blog.myBlog.timestamp",
                    },
                },

                { $sort: { timestamp: 1 } },
            ])
            .toArray()
        return viperBlogs
    } catch (error) {
        throw new Error(`Error getViperBlogs`)
    }
}

export const preloadViperCreatedEvents = (viperId: string): void => {
    void getViperCreatedEvents(viperId)
}
export const getViperCreatedEvents = async (viperId: string): Promise<Event[] | undefined> => {
    const fullViper = await getViperById(viperId)
    // if (!fullViper) return undefined
    const eventsId = fullViper?.myEvents.created.map((event) => {
        return dataBase.createObjectId(JSON.stringify(event._id))
    })
    if (!eventsId) throw new Error("no EventsId bro")
    const events = await dataBase
        .getEventCollection()
        .find({ _id: { $in: eventsId } })
        .sort({ creationDate: -1 })
        .toArray()

    return events
}
