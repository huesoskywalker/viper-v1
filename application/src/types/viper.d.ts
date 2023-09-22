import { DeleteResult, ObjectId } from "mongodb"
import { Event } from "./event"

export type Viper = {
    readonly _id: _ID
    address: Address
    backgroundImage: Image
    biography: Biography
    blogs: Blog
    email: Email
    emailVerified: null
    name: Name
    image: Image
    // location: Location
    shopify: Shopify
    myEvents: MyEvents
    followers: Follow[]
    follows: Follow[]
}

type Image = string

type Biography = string

type Email = string

type Name = string

// type Location = string
export type MyEvents = {
    readonly _id: _ID
    created: CreatedEvent[]
    collection: EventCollection[]
    liked: Likes[]
}
export type CreatedEvent = {
    readonly _id: _ID
}
export type EventCollection = {
    readonly _id: _ID
    readonly checkoutId: string
}
export type Likes = {
    readonly _id: _ID
}
export type Follow = {
    readonly _id: _ID
}
export type Address = {
    phone: number | null | string
    address: string
    province: string
    country: string
    zip: number | null | string
    city: string
}

export type Blog = {
    personal: PersonalBlog[]
    liked: ExternalBlog[]
    commented: ExternalBlog & { comment: string }[]
}

export type PersonalBlog = {
    readonly _id: _ID
    content: string
    likes: Likes[]
    comments: string[]
    timestamp: number
}
// Should be great if we add another DB or Collection for Blogs, and mostly everything
// So we can store only the _id and then map through the blogs and retrieve the comments
// That will make the docs lighter
export type ExternalBlog = {
    readonly _id: _ID
    readonly viperId: _ID
    // we might not need ths since it will be the currentViper
    // and we might get it from some session
    // readonly viper_id: _ID
    timestamp: number
}

export type Chats = {
    readonly _id: _ID
    members: _ID[]
    messages: Message[]
}
export type Message = {
    readonly _id: _ID
    sender: _ID
    message: string
    timestamp: number
}

export type Sender = {
    readonly _id: _ID
    name: string
}
export type Shopify = {
    customerAccessToken: string
    customerId: string
}

export type ViperBasicProps = Pick<
    Viper,
    | "_id"
    | "name"
    | "image"
    | "backgroundImage"
    | "email"
    | "address"
    | "biography"
    | "followers"
    | "follows"
>

// most probably we should do something like this -> (_id needed?)
// Like this will be more clean, pick what we would like to update and then make them optional
export type UpdateViper = Partial<UpdateViperType>
type UpdateViperPick = Pick<
    Viper,
    "_id" | "name" | "biography" | "image" | "backgroundImage" | "location"
>

export type Hex24String = `${
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"}{24}`
// export type Hex24String = string & { length: 24 }

export type _ID = ObjectId | Hex24String
export type UploadViperImage = {
    data: { url } | null
    error: string | null
}

export interface IViperRepository {
    getAll(): Promise<Viper[]>
    getById(viperId: string): Promise<Viper | null>
    getByIdBasicProps(viperId: string): Promise<ViperBasicProps | null>
    // This is one below is built for the search input
    findByUsername(username: string): Promise<Viper[] | null>
    update(viper: UpdateViperType): Promise<WithId<Viper> | null>
    getFollows(viperId: string): Promise<Follow[]>
    // ====================================================
    // should we add getFollowers? check if the function already
    // getFollowers(viperId: string): Promise<Follow[]>
    // =========================================
    isViperFollowed(currentViperId: string, viperId: string): Promise<boolean>
    toggleFollow(
        isFollowed: boolean,
        viperId: string,
        currentViperId: string
    ): Promise<[WithId<Viper> | null, WithId<Viper> | null]>
    // We need to add a initChat type and function
    // initChat(viperId: string, currentViperId: string): Promise
    getBlogs(viperId: string): Promise<WithId<Blog[]> | null>
    createBlog(viperId: string, comment: string): Promise<WithId<Viper> | null>
    isBlogLiked(blogId: string, viperId: string, currentViperId: string): Promise<boolean>
    likeBlog(
        isLiked: boolean,
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<[MWithId<Viper> | null, WithId<Viper> | null]>
    addCommentToBlog(
        blogId: string,
        viperId: string,
        currentViperId: string,
        comment: string
    ): Promise<WithId<Viper>>
    // wonder if we should return an empty[] if it does not have any event
    toggleLikeEvent(
        isLiked: boolean,
        eventId: string,
        viperId: string
    ): Promise<WithId<Viper> | null>
    getLikedEvents(viperId: string): Promise<Likes[]>
    getEventsCollection(viperId: string): Promise<Collection[]>
    isEventParticipationRequested(viperId: string, eventId: string): Promise<boolean>
    requestEventParticipation(
        viperId: string,
        eventId: string,
        checkoutId: string
    ): Promise<WithId<Viper>>
    // check the name convention, we make it different because of the EventRepository, for now
    // addCratedEvent
    addCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null>
    // removeCreatedEvent
    deleteCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null>
    getCreatedEvents(viperId: string): Promise<CreatedEvent[]>
}
