import {
    Blog,
    CreatedEvent,
    EventCollection,
    ExternalBlog,
    Follow,
    IViperRepository,
    Likes,
    UpdateViper,
    Viper,
    ViperBasicProps,
} from "@/types/viper"
import { Collection, Db, ObjectId, WithId } from "mongodb"

export class ViperRepository implements IViperRepository {
    private viperCollection: Collection<Viper>
    constructor(database: Db) {
        this.viperCollection = database.collection<Viper>("users")
    }
    async getAll(): Promise<Viper[]> {
        try {
            const vipers: Viper[] = await this.viperCollection.find<Viper>({}).toArray()
            return vipers
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve Vipers, ${error}`)
        }
    }
    async getById(viperId: string): Promise<Viper | null> {
        try {
            const viper: Viper | null = await this.viperCollection.findOne<Viper>({
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
            const viperBasicProps: Viper | null = await this.viperCollection.findOne<Viper>(
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
    async findByUsername(username: string): Promise<Viper[] | null> {
        try {
            await this.viperCollection.createIndexes([
                {
                    name: "someNewIndex",
                    key: { name: "text" },
                },
            ])

            const viper: Viper[] = await this.viperCollection
                .find({
                    $text: {
                        $search: username,
                    },
                })
                .toArray()

            return viper
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
    async isViperFollowed(currentViperId: string, viperId: string): Promise<boolean> {
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
    async toggleFollow(
        isFollowed: boolean,
        viperId: string,
        currentViperId: string
    ): Promise<[WithId<Viper> | null, WithId<Viper> | null]> {
        try {
            // This isFollowed comes from the method isViperFollowed
            const operation: string = isFollowed ? "$pull" : "$push"

            const addFollower: Promise<WithId<Viper> | null> =
                this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(viperId),
                    },
                    {
                        [operation]: {
                            followers: { _id: new ObjectId(currentViperId) },
                        },
                    }
                )

            const addFollow: Promise<WithId<Viper> | null> = this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(currentViperId),
                },
                {
                    [operation]: {
                        follows: { _id: new ObjectId(viperId) },
                    },
                }
            )
            return Promise.all([addFollower, addFollow])
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to toggle Follow from Viper, ${error}`)
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
            throw new Error(`Repository Error: Failed to if Blog is already liked, ${error}`)
        }
    }
    async likeBlog(
        isLiked: boolean,
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<[WithId<Viper> | null, WithId<Viper> | null]> {
        try {
            let likeBlogObj: Partial<ExternalBlog> = {
                _id: new ObjectId(blogId),
                viperId: new ObjectId(viperId),
                // currentViperId: new ObjectId(currentViperId),
            }
            const operation: string = isLiked ? "$pull" : "$push"
            if (operation === "$push") {
                likeBlogObj = {
                    ...likeBlogObj,
                    timestamp: Date.now(),
                } as ExternalBlog
            }
            const addLikeToBlog: Promise<WithId<Viper> | null> =
                this.viperCollection.findOneAndUpdate(
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

            const addLikedBlog: Promise<WithId<Viper> | null> =
                this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(currentViperId),
                    },
                    {
                        [operation]: {
                            "blogs.liked": likeBlogObj,
                        },
                    }
                )

            return Promise.all([addLikeToBlog, addLikedBlog])
        } catch (error: unknown) {
            // How can we handle different errors from each request ?
            throw new Error(
                `Repository Error: Failed to add like to blog or add blog to liked, ${error}`
            )
        }
    }
    async addCommentToBlog(
        blogId: string,
        viperId: string,
        currentViperId: string,
        comment: string
    ): Promise<[WithId<Viper> | null, WithId<Viper> | null]> {
        try {
            const addComment: Promise<WithId<Viper> | null> =
                this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(viperId),
                        "blogs._id": new ObjectId(blogId),
                    },
                    {
                        $push: {
                            "blogs.$.comments": {
                                _id: new ObjectId(),
                                viperId: new ObjectId(currentViperId),
                                comment: comment,
                                timestamp: Date.now(),
                            },
                        },
                    }
                )
            const addCommentedBlog: Promise<WithId<Viper> | null> =
                this.viperCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(currentViperId),
                    },
                    {
                        $push: {
                            blogCommented: {
                                _id: new ObjectId(blogId),
                                viperId: new ObjectId(viperId),
                                // currentViperId: new ObjectId(currentViperId),
                                comment: comment,
                                timestamp: Date.now(),
                            },
                        },
                    }
                )
            return Promise.all([addComment, addCommentedBlog])
        } catch (error: unknown) {
            // we should manage to split the errors based on the request
            throw new Error(
                `Repository Error: Failed to add comment to blog or to add commented blog, ${error}`
            )
        }
    }
    async toggleLikeEvent(
        isLiked: boolean,
        eventId: string,
        viperId: string
    ): Promise<WithId<Viper> | null> {
        // this func depends on a func from eventCollection
        try {
            const operation: string = isLiked ? "$pull" : "$push"

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
            throw new Error(`Repository Error: Failed to add Liked Event, ${error}`)
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
            throw new Error(`Repository Error: Failed to retrieve participation request, ${error}`)
        }
    }
    async requestEventParticipation(
        viperId: string,
        eventId: string,
        checkoutId: string
    ): Promise<WithId<Viper> | null> {
        try {
            const participationRequest: WithId<Viper> | null =
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
            return participationRequest
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to retrieve Participation request, ${error}`)
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
    async deleteCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null> {
        try {
            const deletedEvent = await this.viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $pull: {
                        "myEvents.create": { _id: new ObjectId(eventId) },
                    },
                }
            )
            return deletedEvent
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to remove created event, ${error}`)
        }
    }
    async getCreatedEvents(viperId: string): Promise<CreatedEvent[]> {
        // Check the previous func at vipers.ts
        // should we also return an empty [] if no createdEvent is found?
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
