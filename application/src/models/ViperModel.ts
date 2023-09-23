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
import { WithId } from "mongodb"

export class ViperModel {
    constructor(private viperRepository: TViperRepository) {}
    async getAll(): Promise<Viper[]> {
        try {
            const vipers = await this.viperRepository.getAll()
            return vipers
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve Vipers, ${error}`)
        }
    }
    async getById(viperId: string): Promise<Viper | null> {
        try {
            const viper: Viper | null = await this.viperRepository.getById(viperId)
            return viper
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve Viper by Id ${error}`)
        }
    }
    async getByIdBasicProps(viperId: string): Promise<ViperBasicProps | null> {
        try {
            const viperBasicProps: ViperBasicProps | null =
                await this.viperRepository.getByIdBasicProps(viperId)
            return viperBasicProps
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve Viper basic Props, ${error}`)
        }
    }
    async findByUsername(username: string): Promise<WithId<Viper>[]> {
        try {
            const vipers: WithId<Viper>[] = await this.viperRepository.findByUsername(username)
            return vipers
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to find Viper by Username, ${error}`)
        }
    }
    async update(viper: UpdateViper): Promise<WithId<Viper> | null> {
        try {
            const updateProfile = await this.viperRepository.update(viper)
            return updateProfile
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to update Viper, ${error}`)
        }
    }
    async getFollows(viperId: string): Promise<Follow[]> {
        try {
            const viperFollows: Follow[] = await this.viperRepository.getFollows(viperId)
            return viperFollows
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve Viper follows, ${error}`)
        }
    }
    async isViperFollowed(viperId: string, currentViperId: string): Promise<boolean> {
        try {
            const isFollowed: boolean = await this.viperRepository.isViperFollowed(
                viperId,
                currentViperId
            )
            return isFollowed
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to check if Viper is already followed, ${error}`)
        }
    }
    async toggleFollow(
        isFollowed: boolean,
        viperId: string,
        currentViperId: string
    ): Promise<[WithId<Viper> | null, WithId<Viper> | null]> {
        try {
            const toggleViperFollower: Promise<WithId<Viper> | null> =
                this.viperRepository.toggleFollower(isFollowed, viperId, currentViperId)
            const toggleCurrentViperFollow: Promise<WithId<Viper> | null> =
                this.viperRepository.toggleCurrentFollow(isFollowed, viperId, currentViperId)
            return Promise.all([toggleViperFollower, toggleCurrentViperFollow])
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to toggle Follow from Viper, ${error}`)
        }
    }
    async getBlogs(viperId: string): Promise<Blog[]> {
        try {
            const viperBlogs: Blog[] = await this.viperRepository.getBlogs(viperId)
            return viperBlogs
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve Blogs, ${error}`)
        }
    }
    async createBlog(viperId: string, comment: string): Promise<WithId<Viper> | null> {
        try {
            const blogContent: WithId<Viper> | null = await this.viperRepository.createBlog(
                viperId,
                comment
            )
            return blogContent
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to create blog, ${error}`)
        }
    }
    async isBlogLiked(blogId: string, viperId: string, currentViperId: string): Promise<boolean> {
        try {
            const isLiked: boolean = await this.viperRepository.isBlogLiked(
                blogId,
                viperId,
                currentViperId
            )
            return isLiked
        } catch (error: unknown) {
            throw new Error(`Repository Error: Failed to if Blog is already liked, ${error}`)
        }
    }
    async toggleBlogLike(
        isLiked: boolean,
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<[WithId<Viper> | null, WithId<Viper> | null]> {
        try {
            const toggleLike = await this.viperRepository.toggleBlogLike(
                isLiked,
                blogId,
                viperId,
                currentViperId
            )
            const toggleLikedBlog = await this.viperRepository.toggleFeedLikedBlog(
                isLiked,
                blogId,
                viperId,
                currentViperId
            )
            return Promise.all([toggleLike, toggleLikedBlog])
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to add like to blog or add liked blog, ${error}`)
        }
    }
    async addBlogComment(
        blogId: string,
        viperId: string,
        currentViperId: string,
        comment: string
    ): Promise<[WithId<Viper> | null, WithId<Viper> | null]> {
        try {
            const addBlogComment: Promise<WithId<Viper> | null> =
                this.viperRepository.addBlogComment(blogId, viperId, currentViperId, comment)
            const addFeedBlog: Promise<WithId<Viper> | null> =
                this.viperRepository.addFeedCommentedBlog(blogId, viperId, currentViperId)
            return Promise.all([addBlogComment, addFeedBlog])
        } catch (error: unknown) {
            throw new Error(
                `Model Error: Failed to add comment to blog or to add commented blog, ${error}`
            )
        }
    }
    async toggleLikeEvent(eventId: string, viperId: string): Promise<WithId<Viper> | null> {
        // We need to grab the eventRepository to check if the event isLiked
        try {
            const toggleLike: WithId<Viper> | null = await this.viperRepository.toggleEventLike(
                isLiked,
                eventId,
                viperId
            )
            return toggleLike
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to toggle event like, ${error}`)
        }
    }
    async getLikedEvents(viperId: string): Promise<Likes[]> {
        try {
            const likedEvents: Likes[] = await this.viperRepository.getLikedEvents(viperId)
            return likedEvents
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve liked Events, ${error}`)
        }
    }
    async getEventsCollection(viperId: string): Promise<EventCollection[]> {
        try {
            const events: EventCollection[] = await this.viperRepository.getEventsCollection(
                viperId
            )
            return events
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve Event Collection, ${error}`)
        }
    }
    async isEventParticipationRequested(viperId: string, eventId: string): Promise<boolean> {
        try {
            const isParticipationRequested: boolean =
                await this.viperRepository.isEventParticipationRequested(viperId, eventId)
            return isParticipationRequested
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to check if participation is requested, ${error}`)
        }
    }
    async requestEventParticipation(
        viperId: string,
        eventId: string,
        checkoutId: string
    ): Promise<WithId<Viper> | null> {
        try {
            const requestParticipation: WithId<Viper> | null =
                await this.viperRepository.requestEventParticipation(viperId, eventId, checkoutId)
            return requestParticipation
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to request participation, ${error}`)
        }
    }
    async addCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null> {
        // We should combine this when we create the event within the eventRepository
        // probably we won't need this method in the ViperMethod
        // Adding both in the create method from the EventModel
        try {
            const createdEvent: WithId<Viper> | null = await this.viperRepository.addCreatedEvent(
                viperId,
                eventId
            )
            return createdEvent
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to add created event, ${error}`)
        }
    }
    async removeCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null> {
        // We should combine this when we delete the event within the eventRepository
        // probably we won't need this method in the ViperMethod
        // Adding both in the create method from the EventModel
        try {
            const removedEvent: WithId<Viper> | null =
                await this.viperRepository.removeCreatedEvent(viperId, eventId)
            return removedEvent
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to remove created event, ${error}`)
        }
    }
    async getCreatedEvents(viperId: string): Promise<CreatedEvent[]> {
        try {
            const createdEvents: CreatedEvent[] = await this.viperRepository.getCreatedEvents(
                viperId
            )
            return createdEvents
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve Created Events, ${error}`)
        }
    }
}
