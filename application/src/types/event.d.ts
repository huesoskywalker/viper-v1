import { DeleteResult, InsertOneResult, WithId, ObjectId } from "mongodb"
import { FormattedAddress, FormattedAddressURL, LatLngLiteral } from "./google-maps-api"
import { _ID } from "./viper"

export type Event = {
    readonly _id: _ID
    organizer: Organizer
    title: Title
    content: Content
    date: EventDate
    time: EventTime
    location: Location
    category: Category
    image: Image
    price: Price
    entries: Entries
    product: Product
    participants: Participant[]
    likes: Like[]
    comments: Comment[]
    creationDate: EventDate
    updatedDate: EventDate
}

export type UpdateEvent = Pick<
    Event,
    "_id" | "title" | "content" | "date" | "category" | "updatedDate" | "price"
>
export type CreateEvent = Pick<
    Event,
    | "organizer"
    | "title"
    | "content"
    | "date"
    | "time"
    | "location"
    | "category"
    | "image"
    | "price"
    | "entries"
    | "product"
>
type Title = string

type Content = string

type EventDate = Date | number

type EventTime = string

type Category = string

type Image = string

type Price = number

type Entries = number

export type Location = {
    address: Address
    coordinates: LatLngLiteral
    url: FormattedAddressURL
}

export type Address = {
    street: string
    postalCode: string
    province: string
    country: string
}
// Check here why string, Probably:
// 1- to go through components as strings instead of Object,
// 2 - no need to place and Object Id, probably won't be a search query.
// Recheck even
export type Organizer = {
    _id: string
    name: string
    email: string
}
export type Participant = {
    readonly _id: _ID
}
export type Like = {
    readonly _id: _ID
}
export type Comment = {
    readonly _id: _ID
    viperId: _ID
    text: string
    likes: Like[]
    replies: Reply[]
    timestamp: number
}

export type Reply = {
    readonly _id: Object
    viperId: string
    reply: string
    likes: Like[]
    timestamp: number
}

export type Product = {
    _id: string
    variant_id: string
}

export type UploadEventImage = {
    data: {
        url: string
        filename: string
        type: string
        size: string
    } | null
    error: string | null
}

interface EventCRUDRepository {
    getAll(): Promise<Event[]>
    getById(eventId: string): Promise<Event | null>
    getByCategory(category: string, sortParam: "likes" | "date" | "creationDate"): Promise<Event[]>
    create(event: CreateEvent): Promise<InsertOneResult<Event>>
    update(event: UpdateEvent): Promise<WithId<Event> | null>
    delete(eventId: string, eventImage: string): Promise<DeleteResult>
}

interface EventInteractionRepository {
    isLiked(eventId: string, viperId: string): Promise<boolean>
    toggleEventLike(
        isLiked: boolean,
        eventId: string,
        viperId: string
    ): Promise<WithId<Event> | null>
    getComments(eventId: string): Promise<Comment[]>
    // we should fix this and instead of using aggregate to return an array we should match the commentId
    // ALSO the return value
    getCommentById(eventId: string, commentId: string): Promise<Comment | null>
    // Wonder if we need this, we use it to set the operation = "$push" | "$pull" is there a better approach?
    isCommentLiked(eventId: string, commentId: string, viperId: string): Promise<boolean>
    toggleLikeOnComment(
        isLiked: boolean,
        eventId: string,
        commentId: string,
        viperId: string
    ): Promise<WithId<Event> | null>
    addComment(eventId: string, viperId: string, comment: string): Promise<WithId<Event> | null>
    getCommentReplies(eventId: string, commentId: string): Promise<Reply[]>
    // same in here that the previous function isCommentLiked
    isCommentReplyLiked(
        eventId: string,
        commentId: string,
        replyId: string,
        viperId: string
    ): Promise<boolean>
    toggleLikeOnCommentReply(
        isLiked: boolean,
        eventId: string,
        commentId: string,
        replyId: string,
        viperId: string
    ): Promise<WithId<Event> | null>
    addReplyToComment(
        eventId: string,
        commentId: string,
        viperId: string,
        comment: string
    ): Promise<WithId<Event> | null>
}

interface EventParticipantRepository {
    isViperParticipant(eventId: string, viperId: string): Promise<boolean>
    // this from below is the claimCard function
    addParticipant(eventId: string, viperId: string): Promise<WithId<Event> | null>
}

export type TEventRepository = EventCRUDRepository &
    EventInteractionRepository &
    EventParticipantRepository
