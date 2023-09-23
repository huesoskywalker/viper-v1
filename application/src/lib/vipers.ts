// import { InsertOneResult, WithId, ObjectId, WithId } from "mongodb"
// import {
//     Viper,
//     Collection,
//     Follow,
//     Blog,
//     Likes,
//     ViperBasicProps,
//     ExternalBlog,
//     MyBlog,
//     Chats,
//     UpdateViper,
// } from "@/types/viper"
// import { getCurrentViper } from "./session"
// import { Session } from "next-auth"
// import { Event } from "@/types/event"
// import { DatabaseService } from "@/services/databaseService"

// const dataBase = await DatabaseService.init()
// const viperCollection = dataBase.getViperCollection()

// export const getViperByUsername = async (username: string): Promise<Viper[] | null> => {
//     try {
//         await viperCollection.createIndexes([
//             {
//                 name: "someNewIndex",
//                 key: { name: "text" },
//             },
//         ])

//         const viper: Viper[] = await viperCollection
//             .find({
//                 $text: {
//                     $search: username,
//                 },
//             })
//             .toArray()

//         return viper
//     } catch (error) {
//         throw new Error(`${error}`)
//     }
// }

export const preloadViperById = (viperId: string | ObjectId): void => {
    void getViperById(viperId)
}
// export const getViperById = async (viperId: string | ObjectId): Promise<Viper | null> => {
//     if (typeof viperId === "object") return null
//     const viper = await viperCollection.findOne<Viper>({
//         _id: dataBase.createObjectId(viperId),
//     })
//     return viper
// }

export const preloadViperBasicProps = (viperId: string): void => {
    void getViperBasicProps(viperId)
}
// export const getViperBasicProps = async (viperId: string): Promise<ViperBasicProps | null> => {
//     try {
//         const viper = await viperCollection.findOne<Viper | null>(
//             {
//                 _id: dataBase.createObjectId(viperId),
//             },
//             {
//                 projection: {
//                     _id: 1,
//                     name: 1,
//                     image: 1,
//                     backgroundImage: 1,
//                     email: 1,
//                     address: 1,
//                     biography: 1,
//                     followers: 1,
//                     follows: 1,
//                 },
//             }
//         )
//         if (!viper) throw new Error(`Bad viper id request`)
//         return viper
//     } catch (error) {
//         throw new Error(`${error}`)
//     }
// }

// export async function getVipers(): Promise<Viper[]> {
//     const vipers = await viperCollection.find<Viper>({}).toArray()
//     if (!vipers) throw new Error("No vipers")
//     return vipers
// }
export const preloadViperCollectionEvents = (viperId: string): void => {
    void getViperCollectionEvents(viperId)
}
// export const getViperCollectionEvents = async (viperId: string): Promise<Collection[]> => {
//     const events = await viperCollection
//         .aggregate<Collection>([
//             {
//                 $match: { _id: dataBase.createObjectId(viperId) },
//             },
//             {
//                 $unwind: "$myEvents.collection",
//             },
//             {
//                 $project: {
//                     _id: "$myEvents.collection._id",
//                     checkoutId: "$myEvents.collection.checkoutId",
//                 },
//             },
//         ])
//         .toArray()

//     return events
// }

// This will be in the api endpoint
export const preloadViperLikedEvents = (viperId: string): void => {
    void getViperLikedEvents(viperId)
}
// export async function getViperLikedEvents(viperId: string): Promise<Likes[]> {
//     const likedEvents = await viperCollection
//         .aggregate<Likes>([
//             {
//                 $match: { _id: dataBase.createObjectId(viperId) },
//             },
//             {
//                 $unwind: "$myEvents.likes",
//             },
//             {
//                 $project: {
//                     _id: "$myEvents.likes._id",
//                 },
//             },
//         ])
//         .toArray()
//     return likedEvents
// }

// export async function getViperFollows(id: string): Promise<Follow[]> {
//     const viperFollows = await viperCollection
//         .aggregate<Follow>([
//             {
//                 $match: { _id: dataBase.createObjectId(id) },
//             },
//             {
//                 $unwind: "$follows",
//             },
//             {
//                 $project: {
//                     _id: "$follows._id",
//                 },
//             },
//         ])
//         .toArray()
//     return viperFollows
// }

export const preloadViperFollowed = (viperId: string): void => {
    void getViperFollowById(viperId)
}
// export const getViperFollowById = async (viperId: string): Promise<boolean> => {
//     const viperSession: Session | null = await getCurrentViper()
//     if (!viperSession) throw new Error("No Viper bro")

//     const viperFollower = await viperCollection.findOne({
//         _id: dataBase.createObjectId(viperId),
//         "followers._id": dataBase.createObjectId(viperSession.user._id),
//     })
//     if (!viperFollower) return false
//     return true
// }

export const preloadIsViperParticipationRequest = (viperId: string, eventId: string): void => {
    void isViperParticipationRequest(viperId, eventId)
}
// export async function isViperParticipationRequest(
//     viperId: string,
//     eventId: string
// ): Promise<boolean> {
//     try {
//         const request = await viperCollection.findOne({
//             _id: dataBase.createObjectId(viperId),
//             "myEvents.collection._id": dataBase.createObjectId(eventId),
//         })

//         if (!request) return false
//         return true
//     } catch (error) {
//         throw new Error("Error en requestEventParticipation")
//     }
// }

export const preloadViperBlogs = (viperId: string): void => {
    void getViperBlogs(viperId)
}

// export const getViperBlogs = async (viperId: string): Promise<Blog[]> => {
//     try {
//         const viperBlogs: Blog[] = await dataBase
//             .getViperCollection()
//             .aggregate<Blog>([
//                 {
//                     $match: {
//                         _id: dataBase.createObjectId(viperId),
//                     },
//                 },
//                 {
//                     $unwind: "$blog",
//                 },
//                 { $unwind: "$blog.myBlog" },
//                 {
//                     $project: {
//                         _id: "$blog.myBlog._id",
//                         content: "$blog.myBlog.content",
//                         likes: "$blog.myBlog.likes",
//                         comments: "$blog.myBlog.comments",
//                         rePosts: "$blog.myBlog.rePosts",
//                         timestamp: "$blog.myBlog.timestamp",
//                     },
//                 },

//                 { $sort: { timestamp: 1 } },
//             ])
//             .toArray()
//         return viperBlogs
//     } catch (error) {
//         throw new Error(`Error getViperBlogs`)
//     }
// }

export const preloadViperCreatedEvents = (viperId: string): void => {
    void getViperCreatedEvents(viperId)
}
// export const getViperCreatedEvents = async (viperId: string): Promise<Event[] | undefined> => {
//     // In this one we should check how to manage it better.
//     // and also we should place the getEventCollection to the EVENT RE POSITORY
//     const fullViper = await getViperById(viperId)
//     const eventsId = fullViper?.myEvents.created.map((event) => {
//         return dataBase.createObjectId(JSON.stringify(event._id))
//     })
//     if (!eventsId) throw new Error("no EventsId bro")
//     const events = await dataBase
//         .getEventCollection()
//         .find({ _id: { $in: eventsId } })
//         .sort({ creationDate: -1 })
//         .toArray()

//     return events
// }

// export const createBlog = async (viperId: string, comment: string): Promise<WithId<Viper>> => {
//     const blogContent: WithId<Viper> | null = await viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(viperId),
//         },
//         {
//             $push: {
//                 "blog.myBlog": {
//                     _id: new ObjectId(),
//                     content: comment,
//                     likes: [],
//                     comments: [],
//                     rePosts: [],
//                     timestamp: Date.now(),
//                 },
//             },
//         }
//     )
//     return blogContent
// }

// export const likeBlog = async (
//     blogOwner_id: string,
//     _id: string,
//     viper_id: string
// ): Promise<[WithId<Viper>, WithId<Viper>]> => {
//     let likeBlogObj: Partial<ExternalBlog> = {
//         blogOwner_id: dataBase.createObjectId(blogOwner_id),
//         _id: dataBase.createObjectId(_id),
//         viper_id: dataBase.createObjectId(viper_id),
//     }
//     const viperBlog: WithId<Viper> | null = await viperCollection.findOne({
//         _id: dataBase.createObjectId(blogOwner_id),
//         "blog.myBlog._id": dataBase.createObjectId(_id),
//     })
//     if (!viperBlog) {
//         throw new Error("Viper or blog not found")
//     }
//     const isLiked: MyBlog | undefined = viperBlog.blog.myBlog.find((blog) =>
//         blog.likes.some((like) => like._id.toString() === viper_id)
//     )
//     const operation: string = isLiked ? "$pull" : "$push"

//     if (operation === "$push") {
//         likeBlogObj = {
//             ...likeBlogObj,
//             timestamp: Date.now(),
//         } as ExternalBlog
//     }
//     const viperBlogUpdate = viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(blogOwner_id),
//             "blog.myBlog._id": dataBase.createObjectId(_id),
//         },
//         {
//             [operation]: { "blog.myBlog.$.likes": { _id: dataBase.createObjectId(viper_id) } },
//         }
//     )

//     const likeBlogUpdate = viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(viper_id),
//         },
//         {
//             [operation]: {
//                 "blog.likes": likeBlogObj,
//             },
//         }
//     )

//     return Promise.all([viperBlogUpdate, likeBlogUpdate])
// }

// export const updateViperProfile = async (viper: UpdateViper) => {
//     const { _id, name, biography, image, backgroundImage, location } = viper
//     const editProfile: WithId<Viper> = await viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(_id as string),
//         },
//         {
//             $set: {
//                 name: name,
//                 biography: biography,
//                 image: image,
//                 backgroundImage: backgroundImage,
//                 location: location,
//             },
//         }
//     )
//     return editProfile
// }

// In the Repository it will be toggleFollow
// export const addFollow = async (
//     viperId: string,
//     currentViperId: string
// ): Promise<[WithId<Viper> | null, WithId<Viper> | null]> => {
//     // Same extract this function in something parallel so the code looks cleaner and readable
//     const isFollowed: WithId<Viper> | null = await viperCollection.findOne({
//         _id: dataBase.createObjectId(viperId),
//         "followers._id": dataBase.createObjectId(currentViperId),
//     })
// const operation: string = isFollowed ? "$pull" : "$push"
// ========================================================
// We should adapt this into the chat page, once it reaches the page, check if isChat or not
// Need to make a request or something where we init the chat somehow

const isChat: WithId<Chats> | null = await dataBase.getChatCollection().findOne({
    $or: [
        {
            members: [dataBase.createObjectId(viperId), dataBase.createObjectId(currentViperId)],
        },
        {
            members: [dataBase.createObjectId(currentViperId), dataBase.createObjectId(viperId)],
        },
    ],
})
if (!isChat) {
    const initChat: InsertOneResult<Chats> = await dataBase.getChatCollection().insertOne({
        _id: new ObjectId(),
        members: [dataBase.createObjectId(viperId), dataBase.createObjectId(currentViperId)],
        messages: [],
    })
}

//     const follower: Promise<WithId<Viper> | null> = viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(viperId),
//         },
//         {
//             [operation]: {
//                 followers: { _id: dataBase.createObjectId(currentViperId) },
//             },
//         }
//     )

//     const follows: Promise<WithId<Viper> | null> = viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(currentViperId),
//         },
//         {
//             [operation]: {
//                 follows: { _id: dataBase.createObjectId(viperId) },
//             },
//         }
//     )
//     return Promise.all([follower, follows])
// }

// export const commentBlog = async (
//     blogOwner_id: string,
//     _id: string,
//     viper_id: string,
//     comment: string
// ): Promise<WithId<Viper>> => {
//     const commentBlog: WithId<Viper> | null = await viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(blogOwner_id),
//             "blog._id": dataBase.createObjectId(_id),
//         },
//         {
//             $push: {
//                 "blog.$.comments": {
//                     _id: new ObjectId(),
//                     viper_id: dataBase.createObjectId(viper_id),
//                     comment: comment,
//                     timestamp: Date.now(),
//                 },
//             },
//         }
//     )
//     const blogCommented = await viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(viper_id),
//         },
//         {
//             $push: {
//                 blogCommented: {
//                     _id: dataBase.createObjectId(_id),
//                     blogOwner_id: dataBase.createObjectId(blogOwner_id),
//                     viper_id: dataBase.createObjectId(viper_id),
//                     comment: comment,
//                     timestamp: Date.now(),
//                 },
//             },
//         }
//     )
//     return commentBlog
// }

// export const requestEventParticipation = async (
//     viperId: string,
//     eventId: string,
//     checkoutId: string
// ) => {
//     const requestEventParticipation = await viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(viperId),
//         },
//         {
//             $push: {
//                 "myEvents.collection": {
//                     _id: dataBase.createObjectId(eventId),
//                     checkoutId: checkoutId,
//                 },
//             },
//         }
//         // { upsert: true }
//     )
//     return requestEventParticipation
// }

// export const toggleLikeEvent = async (
//     viperId: string,
//     eventId: string,
//     operation: "$push" | "$pull"
// ) => {
//     const eventLike = await viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(viperId),
//         },
//         {
//             [operation]: {
//                 "myEvents.likes": {
//                     _id: dataBase.createObjectId(eventId),
//                 },
//             },
//         }
//     )
//     return eventLike
// }

// export const addOrganizedEvent = async (viperId: string, eventId: string) => {
//     const organizedEvent = viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(viperId),
//         },
//         {
//             $push: {
//                 "myEvents.created": {
//                     _id: dataBase.createObjectId(eventId),
//                 },
//             },
//         }
//     )
//     return organizedEvent
// }

// export const deleteOrganizedEvent = async (viperId: string, eventId: string) => {
//     const organizedEvent = viperCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(viperId),
//         },
//         {
//             $pull: {
//                 "myEvents.create": { _id: dataBase.createObjectId(eventId) },
//             },
//         }
//     )
//     return organizedEvent
// }
// export const claimEventCard = async (eventId: string, viperId: string) => {
//     const giftCard = await eventCollection.findOneAndUpdate(
//         {
//             _id: dataBase.createObjectId(eventId),
//         },
//         {
//             $push: {
//                 participants: {
//                     _id: dataBase.createObjectId(viperId),
//                 },
//             },
//         }
//         // we've been using upsert so manage the database to be filled before
//     )
//     return giftCard
// }
