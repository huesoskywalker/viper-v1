import {
    Comment,
    CreateEvent,
    Event,
    Like,
    Reply,
    TEventRepository,
    UpdateEvent,
} from "@/types/event"
import { Collection, Db, DeleteResult, InsertOneResult, ObjectId, WithId } from "mongodb"
import fs from "fs"
import { _ID } from "@/types/viper"

export class EventRepository implements TEventRepository {
    private eventCollection: Collection<Event>
    constructor(database: Db) {
        this.eventCollection = database.collection<Event>("events")
    }
    async getAll(): Promise<Event[]> {
        // This is kind of EventBasicProps
        // aggregate or find?
        // sortBy creationDate or date?
        try {
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
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to get events, ${error}`)
        }
    }
    async getById(eventId: string): Promise<Event | null> {
        try {
            const event: Event | null = await this.eventCollection.findOne<Event>({
                _id: new ObjectId(eventId),
            })
            return event
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to get event by _id, ${error}`)
        }
    }
    async getByCategory(category: string, sortBy?: "likes" | "date"): Promise<Event[]> {
        const sortParam: string = sortBy ? sortBy : "creationDate"
        try {
            // find or aggregate will perform better?
            // find $elemMatch
            // .explain()
            const event: Event[] = await this.eventCollection
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
                    {
                        sort: {
                            [sortParam]: 1,
                        },
                    },
                ])
                .toArray()

            return event
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to get events by category, ${error}`)
        }
    }
    async create(event: CreateEvent): Promise<InsertOneResult<Event>> {
        try {
            const newEvent: InsertOneResult<Event> = await this.eventCollection.insertOne({
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
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to create event, ${error}`)
        }
    }
    async update(event: UpdateEvent): Promise<WithId<Event> | null> {
        try {
            const editedEvent: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(event._id),
                },
                {
                    $set: {
                        title: event.title,
                        content: event.content,
                        date: event.date,
                        category: event.category,
                        updatedDate: event.updatedDate,
                        price: event.price,
                    },
                }
            )
            return editedEvent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to update event, ${error}`)
        }
    }
    async delete(eventId: string, eventImage: string): Promise<DeleteResult> {
        try {
            const deletedEvent = await this.eventCollection.deleteOne({
                _id: new ObjectId(eventId),
            })
            fs.rmSync(`public/uploads/events/${eventImage}`)

            return deletedEvent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to delete event, ${error}`)
        }
    }
    async isLiked(eventId: string, viperId: string): Promise<boolean> {
        // check projection and find how to return _ID type
        try {
            const isLiked: WithId<Event> | null = await this.eventCollection.findOne(
                {
                    _id: new ObjectId(eventId),
                    "likes._id": new ObjectId(viperId),
                },
                {
                    projection: {
                        _id: "likes._id",
                    },
                }
            )
            return isLiked ? true : false
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to check if event is liked, ${error}`)
        }
    }
    async toggleEventLike(
        isLiked: boolean,
        eventId: string,
        viperId: string
    ): Promise<WithId<Event> | null> {
        const operation: string = isLiked ? "$push" : "$pull"
        try {
            const likeEvent: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(eventId),
                },
                {
                    [operation]: {
                        likes: {
                            _id: new ObjectId(viperId),
                        },
                    },
                },
                {
                    // check in here if we should change it for "likes.$._id"
                    projection: {
                        _id: "likes._id",
                    },
                }
            )
            return likeEvent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to toggle event like, ${error}`)
        }
    }
    async getComments(eventId: string): Promise<Comment[]> {
        try {
            const eventComments: Comment[] = await this.eventCollection

                // We should findOne in here and project the comments?
                .aggregate<Comment>([
                    {
                        $match: { _id: new ObjectId(eventId) },
                    },
                    {
                        $unwind: "$comments",
                    },
                    {
                        $project: {
                            _id: "$comments._id",
                            viperId: "$comments.viperId",
                            text: "$comments.text",
                            likes: "$comments.likes",
                            replies: "$comments.replies",
                            timestamp: "$comments.timestamp",
                        },
                    },
                ])
                .toArray()
            return eventComments
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to get event comment, ${error}`)
        }
    }
    async getCommentById(eventId: string, commentId: string): Promise<Comment | null> {
        try {
            const eventComment: Comment | null = await this.eventCollection.findOne<Comment>(
                {
                    _id: new ObjectId(eventId),
                    "comments._id": new ObjectId(commentId),
                },
                {
                    projection: {
                        "comments.$": 1,
                    },
                }
            )
            return eventComment
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to get comment by _id, ${error}`)
        }
    }
    async isCommentLiked(eventId: string, commentId: string, viperId: string): Promise<boolean> {
        // Check with the aggregation pipeline and the unwinds if it will be more efficient
        // than this query
        try {
            const isLiked: Comment | null = await this.eventCollection.findOne<Comment>(
                {
                    _id: new ObjectId(eventId),
                    "comments._id": new ObjectId(commentId),
                    "comments.likes._id": new ObjectId(viperId),
                },
                {
                    projection: {
                        _id: "comments.likes.$._id",
                        // "comments.likes.$._id": 1,
                    },
                }
            )
            return isLiked ? true : false
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to check if comment is liked, ${error}`)
        }
    }
    async toggleLikeOnComment(
        isLiked: boolean,
        eventId: string,
        commentId: string,
        viperId: string
    ): Promise<WithId<Event> | null> {
        const operation: string = isLiked ? "$push" : "$pull"
        try {
            const toggleLike: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(eventId),
                    "comments._id": new ObjectId(commentId),
                },
                {
                    [operation]: {
                        "comments.$.likes": { _id: new ObjectId(viperId) },
                    },
                }
            )
            return toggleLike
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to toggle like on comment, ${error}`)
        }
    }
    async addComment(
        eventId: string,
        viperId: string,
        comment: string
    ): Promise<WithId<Event> | null> {
        try {
            const eventComment: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(eventId),
                },

                {
                    $push: {
                        comments: {
                            _id: new ObjectId(),
                            viperId: new ObjectId(viperId),
                            text: comment,
                            likes: [],
                            replies: [],
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            return eventComment
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to add comment, ${error}`)
        }
    }
    async getCommentReplies(eventId: string, commentId: string): Promise<Reply[] | null> {
        try {
            const eventReplies: Reply[] | null = await this.eventCollection.findOne<Reply[]>(
                {
                    _id: new ObjectId(eventId),
                    "comments._id": new ObjectId(commentId),
                },
                {
                    projection: {
                        _id: 0,
                        replies: "comments.$.replies",
                        // "comments.$.replies": 1,
                    },
                }
            )
            return eventReplies
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to comment the reply, ${error}`)
        }
    }
    async isCommentReplyLiked(
        eventId: string,
        commentId: string,
        replyId: string,
        viperId: string
    ): Promise<boolean> {
        try {
            const isLiked: Like | null = await this.eventCollection.findOne<Like>(
                {
                    _id: new ObjectId(eventId),
                    "comments._id": new ObjectId(commentId),
                    "comments.replies._id": new ObjectId(replyId),
                    "comments.replies.likes._id": new ObjectId(viperId),
                },
                {
                    projection: {
                        _id: "comments.replies.likes._id",
                        // "comments.replies.likes._id": 1,
                    },
                }
            )

            return isLiked ? true : false
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to check if reply is liked, ${error}`)
        }
    }

    async toggleLikeOnCommentReply(
        isLiked: boolean,
        eventId: string,
        commentId: string,
        replyId: string,
        viperId: string
    ): Promise<WithId<Event> | null> {
        // need to figure out how to solve the issue about the projection and the type
        const operation: string = isLiked ? "$pull" : "$push"
        try {
            const toggleLike: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(eventId),
                    "comments._id": new ObjectId(commentId),
                    "comments.replies._id": new ObjectId(replyId),
                },
                {
                    [operation]: {
                        "comments.$[i].replies.$[j].likes": new ObjectId(viperId),
                    },
                },
                {
                    arrayFilters: [
                        {
                            "i._id": new ObjectId(commentId),
                        },
                        {
                            "j._id": new ObjectId(replyId),
                        },
                    ],
                    projection: {
                        _id: "comments.replies.likes._id",
                    },
                }
            )
            return toggleLike
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to toggle like on reply, ${error}`)
        }
        // return toggleLIke ? { _id: toggleLike._id } : null
    }
    async addReplyToComment(
        eventId: string,
        commentId: string,
        viperId: string,
        comment: string
    ): Promise<WithId<Event> | null> {
        try {
            const addReply: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
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
                // {
                //     projection: {
                //         // should we add the projection of the replies ?
                //         // indeed we could avoid returning all the doc
                //     },
                // }
            )
            return addReply
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to add reply to comment, ${error}`)
        }
    }
    async isViperParticipant(eventId: string, viperId: string): Promise<boolean> {
        try {
            const isParticipant: _ID | null = await this.eventCollection.findOne<_ID>(
                {
                    _id: new ObjectId(eventId),
                    "participants._id": new ObjectId(viperId),
                },
                {
                    projection: {
                        _id: "participants._id",
                    },
                }
            )
            return isParticipant ? true : false
        } catch (error: unknown) {
            throw new Error(
                `Repository Error: Failed to check if Viper is Participating, ${error}`
            )
        }
    }
    async addParticipant(eventId: string, viperId: string): Promise<WithId<Event> | null> {
        try {
            const participant: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(eventId),
                },
                {
                    $push: {
                        participants: {
                            _id: new ObjectId(viperId),
                        },
                    },
                }
            )
            return participant
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to add Participant, ${error}`)
        }
    }
}
