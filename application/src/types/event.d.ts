import { DeleteResult, InsertOneResult, ModifyResult, ObjectId } from "mongodb"
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
    participants: Participants[]
    likes: Likes[]
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
export type Participants = {
    readonly _id: _ID
}
export type Likes = {
    readonly _id: _ID
}
export type Comment = {
    readonly _id: _ID
    viperId: _ID
    text: string
    likes: Likes[]
    replies: Reply[]
    timestamp: number
}

export type Reply = {
    readonly _id: Object
    viperId: string
    reply: string
    likes: likes[]
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
    getByCategory(category: string): Promise<Event[]>
    create(event: Event): Promise<InsertOneResult<Event>>
    update(event: EditEvent): Promise<ModifyResult<Event>>
    delete(eventId: string, eventImage: string): Promise<DeleteResult>
}

interface EventInteractionRepository {
    isLiked(eventId: string, viperId: string): Promise<boolean>
    toggleEventLike(
        eventId: string,
        viperId: string,
        operation: string
    ): Promise<ModifyResult<Event>>
    getComments(eventId: string): Promise<Comments[] | null>
    // we should fix this and instead of using aggregate to return an array we should match the commentId
    getCommentById(eventId: string, commentId: string): Promise<Comments | null>
    getCommentReplies(eventId: string, commentId: string, viperId: string): Promise<Reply[]>
    addComment(eventId: string, viperId: string, comment: string): Promise<ModifyResult<Event>>
    // Wonder if we need this, we use it to set the operation = "$push" | "$pull" is there a better approach?
    isCommentLiked(eventId: string, commentId: string, viperId: string): Promise<boolean>
    toggleLikeOnComment(
        eventId: string,
        commentId: string,
        viperId: string,
        operation: "$push" | "$pull"
    ): Promise<ModifyResult<Event>>
    // same in here that the previous function isCommentLiked
    isCommentReplyLiked(
        eventId: string,
        commentId: string,
        replyId: string,
        viperId: string
    ): Promise<boolean>
    toggleLikeOnCommentReply(
        eventId: string,
        commentId: string,
        replyId: string,
        viperId: string,
        operation: "$push" | "$pull"
    ): Promise<ModifyResult<Event>>
    addReplyToComment(
        eventId: string,
        commentId: string,
        viperId: string,
        comment: string
    ): Promise<ModifyResult<Event>>
}

interface EventParticipantRepository {
    isViperParticipant(eventId: string, viperId: string): Promise<boolean>
    // this from below is the claimCard function
    addParticipant(eventId: string, viperId: string): Promise<ModifyResult<Event>>
}

export type TEventRepository = EventBasicRepository &
    EventInteractionRepository &
    EventParticipantRepository
