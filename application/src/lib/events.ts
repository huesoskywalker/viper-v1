import { Event, Comment, Reply, UpdateEvent, CreateEvent } from "@/types/event"
import { DatabaseService } from "@/services/databaseService"
import { existsSync } from "fs"
import fs from "fs"
import { WithId, ObjectId } from "mongodb"

const dataBase = await DatabaseService.init()
const eventCollection = dataBase.getEventCollection()

export const preloadAllEvents = (): void => {
    void getAllEvents()
}
export const getAllEvents = async (): Promise<Event[]> => {
    const events = await eventCollection
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
export const preloadEventById = (eventId: string): void => {
    void getEventById(eventId)
}
export const getEventById = async (eventId: string): Promise<Event | null> => {
    const event = await eventCollection.findOne<Event>({
        _id: dataBase.createObjectId(eventId),
    })
    if (!event) return null
    return event
}
export const preloadEventsByCategory = (category: string): void => {
    void getEventsByCategory(category)
}
export async function getEventsByCategory(category: string): Promise<Event[]> {
    const event = await eventCollection
        .aggregate<Event>([
            {
                $match: { category: category },
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
                    likes: 1,
                },
            },
            // in here we should add the sort parameter instead of using the sortBy() from above
            {
                sort: {
                    creationDate: 1,
                },
            },
        ])
        .toArray()

    return event
}

export async function sortEventByCategoryAndSlug(
    category: string,
    property: string
): Promise<Event[]> {
    const event = await getEventsByCategory(category)
    event.sort(sortBy(property))
    return event
}

function sortBy(field: string) {
    return function (a: any, b: any) {
        if (field === "likes") {
            if (a[field] < b[field].length) {
                return 1
            } else if (a[field].length > b[field].length) {
                return -1
            }
            return 0
        } else if (a[field] > b[field]) {
            return 1
        } else if (a[field] < b[field]) {
            return -1
        }
        return 0
    }
}

export const preloadEventComments = (eventId: string): void => {
    void getEventComments(eventId)
}
export const getEventComments = async (
    eventId: string
): Promise<{ title: string; comment: Comment }[]> => {
    const eventComments = await eventCollection
        .aggregate<{ title: string; comment: Comment }>([
            {
                $match: { _id: dataBase.createObjectId(eventId) },
            },
            {
                $unwind: "$comments",
            },
            {
                $project: {
                    // _id: 1,
                    title: 1,
                    comment: {
                        _id: "$comments._id",
                        viperId: "$comments.viperId",
                        text: "$comments.text",
                        likes: "$comments.likes",
                        replies: "$comments.replies",
                        timestamp: "$comments.timestamp",
                    },
                },
            },
        ])
        .toArray()
    return eventComments
}

export async function getEventCommentById(
    eventId: string,
    commentId: string
): Promise<Comment[] | null> {
    const eventComment = await eventCollection
        .aggregate<Comment>([
            {
                $match: {
                    _id: dataBase.createObjectId(eventId),
                },
            },
            {
                $unwind: "$comments",
            },

            {
                $match: {
                    "comments._id": dataBase.createObjectId(commentId),
                },
            },

            {
                $project: {
                    _id: "$comments._id",
                    eventTitle: "$title",
                    viperId: "$comments.viperId",
                    text: "$comments.text",
                    likes: "$comments.likes",
                    replies: "$comments.replies",
                    timestamp: "$comments.timestamp",
                },
            },
        ])
        .toArray()
    if (!eventComment) return null
    return eventComment
}

export async function getEventCommentReplies(
    eventId: string,
    commentId: string,
    viperId: string
): Promise<Reply[]> {
    const eventReplies = await dataBase
        .getEventCollection()
        .aggregate<Reply>([
            {
                $match: {
                    _id: dataBase.createObjectId(eventId),
                },
            },
            {
                $unwind: "$comments",
            },
            {
                $match: {
                    "comments._id": dataBase.createObjectId(commentId),
                    "comments.viperId": dataBase.createObjectId(viperId),
                },
            },
            {
                $unwind: "$comments.replies",
            },
            {
                $project: {
                    _id: "$comments.replies._id",
                    viperId: "$comments.replies.viperId",
                    reply: "$comments.replies.reply",
                    likes: "$comments.replies.likes",
                    timestamp: "$comments.replies.timestamp",
                },
            },
        ])
        .toArray()

    return eventReplies
}

export const preloadIsViperOnTheList = (eventId: string, viperId: string): void => {
    void isViperOnTheList(eventId, viperId)
}
export const isViperOnTheList = async (eventId: string, viperId: string): Promise<boolean> => {
    const isParticipant = await eventCollection.findOne({
        _id: dataBase.createObjectId(eventId),
        "participants._id": dataBase.createObjectId(viperId),
    })

    return isParticipant ? true : false
}

export const claimEventCard = async (
    eventId: string,
    viperId: string
): Promise<WithId<Event> | null> => {
    const giftCard: WithId<Event> | null = await eventCollection.findOneAndUpdate(
        {
            _id: dataBase.createObjectId(eventId),
        },
        {
            $push: {
                participants: {
                    _id: dataBase.createObjectId(viperId),
                },
            },
        }
        // we've been using upsert so manage the database to be filled before
    )
    return giftCard
}
export const isEventLiked = async (eventId: string, viperId: string): Promise<boolean> => {
    const isLiked: WithId<Event> | null = await eventCollection.findOne({
        _id: dataBase.createObjectId(eventId),
        "likes._id": dataBase.createObjectId(viperId),
    })
    return isLiked ? true : false
}
export const toggleEventLike = async (
    eventId: string,
    viperId: string,
    operation: "$push" | "$pull"
) => {
    const likeEvent = await eventCollection.findOneAndUpdate(
        {
            _id: dataBase.createObjectId(eventId),
        },
        {
            [operation]: {
                likes: {
                    _id: dataBase.createObjectId(viperId),
                },
            },
        }
    )
    return likeEvent
}

export const createEvent = async (event: CreateEvent) => {
    const newEvent = await eventCollection.insertOne({
        _id: new ObjectId(),
        organizer: event.organizer,
        title: event.title,
        content: event.content,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        image: event.image,
        price: event.price,
        entries: event.entries,
        product: event.product,
        participants: [],
        likes: [],
        comments: [],
        creationDate: Date.now(),
        updatedDate: Date.now(),
    })
    return newEvent
}

export const updateEvent = async (event: UpdateEvent) => {
    const { _id, title, content, date, category, updatedDate, price } = event
    const editedEvent = await eventCollection.findOneAndUpdate(
        {
            _id: dataBase.createObjectId(_id as string),
        },
        {
            // in here we should remove the location or add
            // the address when editing an event
            $set: {
                title: title,
                content: content,
                date: date,
                category: category,
                updatedDate: updatedDate,
                price: price,
            },
        }
    )
    return editedEvent
}

export const deleteEvent = async (eventId: string, eventImage: string) => {
    const deletedEvent = await eventCollection.deleteOne({
        _id: dataBase.createObjectId(eventId),
    })

    if (existsSync(`public/upload/${eventImage}`)) {
        fs.rmSync(`public/upload/${eventImage}`)
    }
    return deletedEvent
}

export const addComment = async (
    eventId: string,
    viperId: string,
    comment: string
): Promise<WithId<Event> | null> => {
    const eventComment: WithId<Event> | null = await eventCollection.findOneAndUpdate(
        {
            _id: dataBase.createObjectId(eventId),
        },

        {
            $push: {
                comments: {
                    _id: new ObjectId(),
                    viperId: dataBase.createObjectId(viperId),
                    text: comment,
                    likes: [],
                    replies: [],
                    timestamp: Date.now(),
                },
            },
        }
    )
    return eventComment
}

export const isCommentLiked = async (eventId: string, commentId: string, viperId: string) => {
    // Build this different, instead of an aggregation a match
    const isLiked = await eventCollection
        .aggregate([
            {
                $match: {
                    _id: new ObjectId(eventId),
                },
            },
            {
                $unwind: "$comments",
            },
            {
                $match: {
                    "comments._id": new ObjectId(commentId),
                },
            },
            {
                $unwind: "$comments.likes",
            },
            {
                $match: { "comments.likes": new ObjectId(viperId) },
            },
            {
                $project: { _id: 0, "comments.likes": 1 },
            },
        ])
        .toArray()
    return isLiked ? true : false
}

export const toggleLikeOnComment = async (
    eventId: string,
    commentId: string,
    viperId: string,
    operation: "$push" | "$pull"
) => {
    const toggleLike = await eventCollection.findOneAndUpdate(
        {
            _id: new ObjectId(eventId),
            comments: {
                $elemMatch: {
                    _id: new ObjectId(commentId),
                },
            },
        },
        {
            [operation]: {
                "comments.$.likes": new ObjectId(viperId),
            },
        }
    )
    return toggleLike
}

export const isCommentReplyLiked = async (
    eventId: string,
    commentId: string,
    replyId: string,
    viperId: string
): Promise<boolean> => {
    // perform better this instead of a aggregate make a find and match
    const isLiked = await eventCollection
        .aggregate([
            {
                $match: {
                    _id: dataBase.createObjectId(eventId),
                },
            },
            {
                $unwind: "$comments",
            },
            {
                $match: {
                    "comments._id": dataBase.createObjectId(commentId),
                },
            },
            {
                $unwind: "$comments.replies",
            },
            {
                $match: {
                    "comments.replies._id": dataBase.createObjectId(replyId),
                    "comments.replies.likes": dataBase.createObjectId(viperId),
                },
            },
            {
                $project: {
                    _id: 0,
                    "comments.replies": 1,
                },
            },
        ])
        .toArray()
    return isLiked ? true : false
}

export const toggleLikeOnCommentReply = async (
    eventId: string,
    commentId: string,
    replyId: string,
    viperId: string,
    operation: "$push" | "$pull"
) => {
    const toggleLike = await eventCollection.findOneAndUpdate(
        {
            _id: dataBase.createObjectId(eventId),
            "comments._id": dataBase.createObjectId(commentId),
            "comments.replies._id": dataBase.createObjectId(replyId),
        },
        {
            [operation]: {
                "comments.$[i].replies.$[j].likes": dataBase.createObjectId(viperId),
            },
        },
        {
            arrayFilters: [
                {
                    "i._id": dataBase.createObjectId(commentId),
                },
                {
                    "j._id": dataBase.createObjectId(replyId),
                },
            ],
        }
    )
    return toggleLike
}

export const addReplyToComment = async (
    eventId: string,
    commentId: string,
    viperId: string,
    comment: string
): Promise<WithId<Event> | null> => {
    const addReply: WithId<Event> | null = await eventCollection.findOneAndUpdate(
        {
            _id: new ObjectId(eventId),
            "comments._id": new ObjectId(commentId),
        },
        {
            $push: {
                "comments.$.replies": {
                    _id: new ObjectId(),
                    viperId: new ObjectId(viperId),
                    reply: comment,
                    likes: [],
                    timestamp: Date.now(),
                },
            },
        }
    )
    return addReply
}
