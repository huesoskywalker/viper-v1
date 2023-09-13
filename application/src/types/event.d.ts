import { DeleteResult, InsertOneResult, ModifyResult, ObjectId } from "mongodb"
import { FormattedAddress, FormattedAddressURL, LatLngLiteral } from "./google-maps-api"
import { _ID } from "./viper"

export type Event = {
    readonly _id: _ID
    organizer: Organizer
    title: Title
    content: Content
    location: Location
    date: Date
    category: Category
    image: Image
    price: Price
    entries: Entries
    product: Product
    participants: Participants[]
    likes: Likes[]
    comments: Comment[]
    creationDate: Date
    updatedDate: Date
}

type Title = string

type Content = string

type Date = string | number

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
    readonly _id: ObjectId | string
}
export type Likes = {
    readonly _id: ObjectId | string
}
export type Comment = {
    readonly _id: ObjectId | string
    viperId: ObjectId | string
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

export type UpdateEvent = Pick<
    Event,
    "_id" | "title" | "content" | "date" | "category" | "updatedDate" | "price"
>

export type EventUploadImage = {
    data: {
        url: string
        filename: string | null
        type: string | null
        size: string | null
    } | null
    error: string | null
}

export type IEventRepository = {
    getAll(): Promise<Eventtype[]>
    getById(eventId: string): Promise<Eventtype | null>
    getByCategory(category: string): Promise<Eventtype[]>
    getComments(eventId: string): Promise<Comments[] | null>
    // we should fix this and instead of using aggregate to return an array we should match the commentId
    getCommentById(eventId: string, commentId: string): Promise<Comments | null>
    getCommentReplies(eventId: string, commentId: string, viperId: string): Promise<Reply[]>
    isViperParticipant(eventId: string, viperId: string): Promise<boolean>
    // this from below is the claimCard function
    addParticipant(eventId: string, viperId: string): Promise<ModifyResult<Eventtype>>
    isLiked(eventId: string, viperId: string): Promise<boolean>
    toggleEventLike(
        eventId: string,
        viperId: string,
        operation: string
    ): Promise<ModifyResult<Eventtype>>
    // addLike(eventId: string, viperId: string): Promise<ModifyResult<Eventtype>>
    // removeLike(eventId: string, viperId: string): Promise<ModifyResult<Eventtype>>
    create(event: Eventtype): Promise<InsertOneResult<Eventtype>>
    update(event: EditEventType): Promise<ModifyResult<Eventtype>>
    delete(eventId: string, eventImage: string): Promise<DeleteResult>
    addComment(eventId: string, viperId: string, comment: string): Promise<ModifyResult<Eventtype>>
    // Wonder if we need this, we use it to set the operation = "$push" | "$pull" is there a better approach?
    isCommentLiked(eventId: string, commentId: string, viperId: string): Promise<boolean>
    toggleLikeOnComment(
        eventId: string,
        commentId: string,
        viperId: string,
        operation: "$push" | "$pull"
    ): Promise<ModifyResult<Eventtype>>
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
    ): Promise<ModifyResult<Eventtype>>
    addReplyToComment(
        eventId: string,
        commentId: string,
        viperId: string,
        comment: string
    ): Promise<ModifyResult<Eventtype>>
}
