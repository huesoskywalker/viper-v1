import {
    Blog,
    CreatedEvent,
    EventCollection,
    Follow,
    Likes,
    TViperRepository,
    UpdateViper,
    Viper,
    ViperBasicProps,
} from "@/types/viper"
import { Collection, Db, ObjectId, WithId } from "mongodb"

export class ViperRepository implements TViperRepository {
    private viperCollection: Collection<Viper>
    constructor(database: Db) {
        this.viperCollection = database.collection<Viper>("users")
    }
    async getAll(): Promise<WithId<Viper>[]> {
        try {
            const vipers: WithId<Viper>[] = await this.viperCollection.find({}).toArray()
            return vipers
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve Vipers, ${error}`)
        }
    }
    async getById(viperId: string): Promise<WithId<Viper> | null> {
        try {
            const viper: WithId<Viper> | null = await this.viperCollection.findOne({
                _id: new ObjectId(viperId),
            })
            return viper
        } catch (error: unknown) {
            // Add winston logger??? what do you think?
            throw new Error(`Repository Error: Failed to retrieve Viper by Id, ${error}`)
        }
    }
    async getByIdBasicProps(viperId: string): Promise<ViperBasicProps | null> {
        try {
            const viperBasicProps: WithId<Viper> | null = await this.viperCollection.findOne(
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
                        address: 1,
                        biography: 1,
                        followers: 1,
                        follows: 1,
                    },
                }
            )
            return viperBasicProps
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve Viper basic Props, ${error}`)
        }
    }
    async findByUsername(username: string): Promise<Viper[]> {
        try {
            await this.viperCollection.createIndexes([
                {
                    name: "someNewIndex",
                    key: { name: "text" },
                },
            ])

            const vipers: Viper[] = await this.viperCollection
                .find<Viper>({
                    $text: {
                        $search: username,
                    },
                })
                .toArray()

            return vipers
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to find Viper by Username, ${error}`)
        }
    }
    async update(viper: UpdateViper): Promise<WithId<Viper> | null> {
        try {
            const { _id, name, biography, image, backgroundImage, location } = viper
            const updateProfile: WithId<Viper> | null =
                await this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(_id as string),
                    },
                    {
                        $set: {
                            name: name,
                            biography: biography,
                            image: image,
                            backgroundImage: backgroundImage,
                            location: location,
                        },
                    }
                )
            return updateProfile
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to update Viper, ${error}`)
        }
    }
    async getFollows(viperId: string): Promise<Follow[]> {
        try {
            const viperFollows: Follow[] = await this.viperCollection
                .aggregate<Follow>([
                    {
                        $match: { _id: new ObjectId(viperId) },
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
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve Viper follows, ${error}`)
        }
    }
    async isViperFollowed(viperId: string, currentViperId: string): Promise<boolean> {
        try {
            const isFollowed: WithId<Viper> | null = await this.viperCollection.findOne({
                _id: new ObjectId(viperId),
                "followers._id": new ObjectId(currentViperId),
            })
            return isFollowed ? true : false
        } catch (error: unknown) {
            throw new Error(
                `Repository Error: Failed to check if Viper is already followed, ${error}`
            )
        }
    }
    async toggleFollower(
        isFollowed: boolean,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null> {
        const operation: string = isFollowed ? "$pull" : "$push"
        try {
            const toggleFollower: WithId<Viper> | null =
                await this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(viperId),
                    },
                    {
                        [operation]: {
                            followers: { _id: new ObjectId(currentViperId) },
                        },
                    }
                )

            return toggleFollower
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to ${operation} Viper follower, ${error}`)
        }
    }
    async toggleCurrentFollow(
        isFollowed: boolean,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null> {
        const operation: string = isFollowed ? "$pull" : "$push"
        try {
            const toggleCurrentFollow: Promise<WithId<Viper> | null> =
                this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(currentViperId),
                    },
                    {
                        [operation]: {
                            follows: { _id: new ObjectId(viperId) },
                        },
                    }
                )
            return toggleCurrentFollow
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to ${operation} current Follow, ${error}`)
        }
    }
    async getBlogs(viperId: string): Promise<Blog[]> {
        try {
            const viperBlogs: Blog[] = await this.viperCollection
                .aggregate<Blog>([
                    {
                        $match: {
                            _id: new ObjectId(viperId),
                        },
                    },
                    {
                        $unwind: "$blogs",
                    },
                    { $unwind: "$blogs.personal" },
                    {
                        $project: {
                            _id: "$blogs.personal._id",
                            content: "$blogs.personal.content",
                            likes: "$blogs.personal.likes",
                            comments: "$blogs.personal.comments",
                            timestamp: "$blogs.personal.timestamp",
                        },
                    },

                    { $sort: { timestamp: 1 } },
                ])
                .toArray()
            return viperBlogs
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve Blogs, ${error}`)
        }
    }
    async createBlog(viperId: string, comment: string): Promise<WithId<Viper> | null> {
        try {
            const blogContent: WithId<Viper> | null = await this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $push: {
                        "blogs.personal": {
                            _id: new ObjectId(),
                            content: comment,
                            likes: [],
                            comments: [],
                            rePosts: [],
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            return blogContent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to create blog, ${error}`)
        }
    }
    async isBlogLiked(blogId: string, viperId: string, currentViperId: string): Promise<boolean> {
        try {
            const isLiked: WithId<Viper> | null = await this.viperCollection.findOne({
                _id: new ObjectId(viperId),
                "blogs.personal": {
                    $elemMatch: {
                        _id: new ObjectId(blogId),
                        "likes._id": new ObjectId(currentViperId),
                    },
                },
            })
            return isLiked ? true : false
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to check if Blog is already liked, ${error}`)
        }
    }
    async toggleBlogLike(
        isLiked: boolean,
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null> {
        const operation: string = isLiked ? "$pull" : "$push"
        try {
            const toggleLike: WithId<Viper> | null = await this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                    "blogs.personal._id": new ObjectId(blogId),
                },
                {
                    [operation]: {
                        "blogs.personal.$.likes": { _id: new ObjectId(currentViperId) },
                    },
                }
            )

            return toggleLike
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to ${operation} blog like , ${error}`)
        }
    }
    async toggleFeedLikedBlog(
        isLiked: boolean,
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null> {
        const operation: string = isLiked ? "$pull" : "$push"
        try {
            const toggleLikedBlog: Promise<WithId<Viper> | null> =
                this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(currentViperId),
                    },
                    {
                        [operation]: {
                            "blogs.liked": {
                                _id: new ObjectId(blogId),
                                viperId: new ObjectId(viperId),
                            },
                        },
                    }
                )
            return toggleLikedBlog
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to ${operation} liked blog, ${error}`)
        }
    }
    async addBlogComment(
        blogId: string,
        viperId: string,
        currentViperId: string,
        comment: string
    ): Promise<WithId<Viper> | null> {
        try {
            const addComment: WithId<Viper> | null = await this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                    "blogs._id": new ObjectId(blogId),
                },
                {
                    $push: {
                        "blogs.$.comments": {
                            _id: new ObjectId(),
                            viperId: new ObjectId(currentViperId),
                            content: comment,
                            likes: [],
                            timestamp: Date.now(),
                        },
                    },
                }
            )

            return addComment
        } catch (error: unknown) {
            // we should manage to split the errors based on the request
            throw new Error(`Repository Error: Failed to add comment to blog, ${error}`)
        }
    }
    async addFeedCommentedBlog(
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null> {
        try {
            const addFeedBlog: WithId<Viper> | null = await this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(currentViperId),
                },
                {
                    $push: {
                        "blogs.commented": {
                            _id: new ObjectId(blogId),
                            viperId: new ObjectId(viperId),
                        },
                    },
                }
            )
            return addFeedBlog
        } catch (error: unknown) {
            throw new Error(`Repository Error:Failed to add commented blog into feed, ${error}`)
        }
    }
    async toggleEventLike(
        isLiked: boolean,
        eventId: string,
        viperId: string
    ): Promise<WithId<Viper> | null> {
        // this func depends on a func from eventCollection
        const operation: string = isLiked ? "$pull" : "$push"
        try {
            const eventLike: WithId<Viper> | null = await this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    [operation]: {
                        "myEvents.liked": {
                            _id: new ObjectId(eventId),
                        },
                    },
                }
            )
            return eventLike
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to ${operation} Liked Event, ${error}`)
        }
    }
    async getLikedEvents(viperId: string): Promise<Likes[]> {
        try {
            const likedEvents: Likes[] = await this.viperCollection
                .aggregate<Likes>([
                    {
                        $match: { _id: new ObjectId(viperId) },
                    },
                    {
                        $unwind: "$myEvents.liked",
                    },
                    {
                        $project: {
                            _id: "$myEvents.liked._id",
                        },
                    },
                ])
                .toArray()
            return likedEvents
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve liked Events, ${error}`)
        }
    }

    async getEventsCollection(viperId: string): Promise<EventCollection[]> {
        try {
            const events: EventCollection[] = await this.viperCollection
                .aggregate<EventCollection>([
                    {
                        $match: { _id: new ObjectId(viperId) },
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
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve Event Collection, ${error}`)
        }
    }
    async isEventParticipationRequested(viperId: string, eventId: string): Promise<boolean> {
        try {
            const isParticipationRequested: WithId<Viper> | null =
                await this.viperCollection.findOne({
                    _id: new ObjectId(viperId),
                    "myEvents.collection._id": new ObjectId(eventId),
                })
            return isParticipationRequested ? true : false
        } catch (error: unknown) {
            throw new Error(
                `Repository Error: Failed to check if participation is requested, ${error}`
            )
        }
    }
    async requestEventParticipation(
        viperId: string,
        eventId: string,
        checkoutId: string
    ): Promise<WithId<Viper> | null> {
        try {
            const requestParticipation: WithId<Viper> | null =
                await this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(viperId),
                    },
                    {
                        $push: {
                            "myEvents.collection": {
                                _id: new ObjectId(eventId),
                                checkoutId: checkoutId,
                            },
                        },
                    }
                    // check if needed the last document
                    // {
                    //     returnDocument: "after"
                    // }
                )
            return requestParticipation
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to request participation, ${error}`)
        }
    }

    async addCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null> {
        try {
            const createdEvent: WithId<Viper> | null = await this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $push: {
                        "myEvents.created": {
                            _id: new ObjectId(eventId),
                        },
                    },
                }
            )
            return createdEvent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to add created event, ${error}`)
        }
    }
    async removeCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null> {
        try {
            const deletedEvent = await this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $pull: {
                        "myEvents.created": { _id: new ObjectId(eventId) },
                    },
                }
            )
            return deletedEvent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to remove created event, ${error}`)
        }
    }
    async getCreatedEvents(viperId: string): Promise<CreatedEvent[]> {
        try {
            const createdEvents: CreatedEvent[] = await this.viperCollection
                .aggregate<CreatedEvent>([
                    {
                        $match: {
                            _id: new ObjectId(viperId),
                        },
                    },
                    {
                        $unwind: "$myEvents.created",
                    },
                    {
                        $project: {
                            _id: "$myEvents.created._id",
                        },
                    },
                ])
                .toArray()
            return createdEvents
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve Created Events, ${error}`)
        }
    }
}
