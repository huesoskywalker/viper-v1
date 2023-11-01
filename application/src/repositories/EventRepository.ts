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
        // find().project<EventBasicProps>()
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

    async getByCategory(
        category: string,
        sortBy: "likes" | "date" | "creationDate"
    ): Promise<Event[]> {
        const sortParam: string = sortBy ? sortBy : "creationDate"
        try {
            // find or aggregate will perform better?
            // .explain()
            const event = await this.eventCollection
                // .aggregate<Event>([
                .find<Event>({ category: category })
                // This should be EventBasicProps
                .project<Event>({
                    _id: 1,
                    title: 1,
                    content: 1,
                    location: 1,
                    date: 1,
                    category: 1,
                    image: 1,
                    likes: 1,
                })
                .sort({ [sortParam]: 1 })
                // {
                //     $match: { category: category },
                // },
                // {
                //     $project: {
                //         _id: 1,
                //         title: 1,
                //         content: 1,
                //         location: 1,
                //         date: 1,
                //         category: 1,
                //         image: 1,
                //         likes: 1,
                //     },
                // },
                //     {
                //         sort: {
                //             [sortParam]: 1,
                //         },
                //     },
                // ])
                .limit(20)
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
            const updatedEvent: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
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
            return updatedEvent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to update event, ${error}`)
        }
    }

    async delete(eventId: string, eventImage: string): Promise<DeleteResult> {
        try {
            const deletedEvent: DeleteResult = await this.eventCollection.deleteOne({
                _id: new ObjectId(eventId),
            })
            fs.rmSync(`public/uploads/events/${eventImage}`)

            return deletedEvent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to delete event, ${error}`)
        }
    }

    async isLiked(eventId: string, viperId: string): Promise<boolean> {
        try {
            const isLiked: _ID | null = await this.eventCollection.findOne<_ID>(
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
            const toggleLike: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
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
            return toggleLike
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to toggle event like, ${error}`)
        }
    }

    async getComments(eventId: string): Promise<Comment[]> {
        try {
            const eventComments: Comment[] = await this.eventCollection
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
                // this is for pagination, each page does have the limit we assign
                // .skip()
                .limit(10)
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
            const isLiked: _ID | null = await this.eventCollection.findOne<_ID>(
                {
                    _id: new ObjectId(eventId),
                    "comments._id": new ObjectId(commentId),
                    "comments.likes._id": new ObjectId(viperId),
                },
                {
                    projection: {
                        _id: "comments.likes._id",
                        // _id: "comments.likes.$._id",
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
                },
                {
                    projection: {
                        _id: "comments._id",
                        likes: "comments.likes",
                    },
                }
            )
            // Something like this to return the actual values from the Projection
            // const value = toggleLike?.comments[0].likes as Like[]
            // return value
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
            const newComment: WithId<Event> | null = await this.eventCollection.findOneAndUpdate(
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
                },
                {
                    projection: {
                        _id: 1,
                        comments: 1,
                    },
                }
            )
            return newComment
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to add comment, ${error}`)
        }
    }

    async getCommentReplies(eventId: string, commentId: string): Promise<Reply[]> {
        try {
            const eventReplies: Reply[] = await this.eventCollection
                // most probably we would need to change it to aggregate
                // to handle the projection
                .find<Reply>(
                    {
                        _id: new ObjectId(eventId),
                        "comments._id": new ObjectId(commentId),
                    },
                    {
                        projection: {
                            _id: "comments.replies._id",
                            viperId: "comments.replies.viperId",
                            reply: "comments.replies.reply",
                            likes: "comments.replies.likes",
                            timestamp: "comments.replies.timestamp",
                        },
                    }
                )
                .limit(10)
                .toArray()
            return eventReplies
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to comment the reply, ${error}`)
        }
    }

    // we could change this name to isReplyLiked ?
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
                    },
                }
            )

            return isLiked ? true : false
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to check if reply is liked, ${error}`)
        }
    }

    // should we change this to toggleLikeOnReply?
    async toggleLikeOnCommentReply(
        isLiked: boolean,
        eventId: string,
        commentId: string,
        replyId: string,
        viperId: string
    ): Promise<WithId<Event> | null> {
        const operation: string = isLiked ? "$pull" : "$push"
        try {
            // need to figure out how to solve the issue about the projection and the type
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
                        // likes: "comment.replies.likes"
                    },
                }
            )
            return toggleLike
            // return toggleLIke ? { _id: toggleLike._id } : null
            // or
            // return toggleLike ? { likes: toggleLike.likes } : null
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to toggle like on reply, ${error}`)
        }
    }

    // we could also change to addReply
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
                },
                {
                    projection: {
                        replies: "comments.replies",
                        // replies: {
                        //     $slice: -1,
                        // },
                    },
                }
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
            const newParticipant: WithId<Event> | null =
                await this.eventCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(eventId),
                    },
                    {
                        $push: {
                            participants: {
                                _id: new ObjectId(viperId),
                            },
                        },
                    },
                    {
                        projection: {
                            participants: "participants",
                        },
                    }
                )
            return newParticipant
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to add Participant, ${error}`)
        }
    }
}
