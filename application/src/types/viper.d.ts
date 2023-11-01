import { DeleteResult, ObjectId, WithId } from "mongodb"
import { Event } from "./event"
import { Session } from "next-auth"

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
    commented: ExternalBlog[]
}

export type PersonalBlog = {
    readonly _id: _ID
    content: string
    likes: Likes[]
    comments: BlogComment[]
    timestamp: number
}

export type BlogComment = {
    readonly _id: _ID
    viperId: _ID
    content: string
    likes: Likes[]
    // if we want to keep nesting we should uncomment the following
    // comments: BlogComment[]
    timestamp: number
}
// Should be great if we add another DB or Collection for Blogs, and mostly everything
// So we can store only the _id and then map through the blogs and retrieve the comments
// That will make the docs lighter
export type ExternalBlog = {
    readonly _id: _ID
    readonly viperId: _ID
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

interface ViperCRUDRepository {
    // Since this use cookies I don't think it is a good choice to stablish a db connection
    // getSession(): Promise<Session | null>
    getAll(): Promise<WithId<Viper>[]>
    getById(viperId: string): Promise<WithId<Viper> | null>
    getByIdBasicProps(viperId: string): Promise<WithId<ViperBasicProps> | null>
    // This is one below is built for the search input
    findByUsername(username: string): Promise<ViperBasicProps[]>
    update(viper: UpdateViper): Promise<WithId<Viper> | null>
}

interface ViperFollowRepository {
    // ====================================================
    // should we add getFollowers? check if the function already
    // getFollowers(viperId: string): Promise<Follow[]>
    // =========================================
    getFollows(viperId: string): Promise<Follow[]>
    isViperFollowed(viperId: string, currentViperId: string): Promise<boolean>
    toggleFollower(
        isFollowed: boolean,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null>
    toggleCurrentFollow(
        isFollowed: boolean,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null>
    // We need to add a initChat type and function
    // ======IMPORTANT=====
    // initChat(viperId: string, currentViperId: string): Promise
}
interface ViperBlogRepository {
    getBlogs(viperId: string): Promise<Blog[]>
    createBlog(viperId: string, comment: string): Promise<WithId<Viper> | null>
    isBlogLiked(blogId: string, viperId: string, currentViperId: string): Promise<boolean>
    toggleBlogLike(
        isLiked: boolean,
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null>
    toggleFeedLikedBlog(
        isLiked: boolean,
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null>
    addBlogComment(
        blogId: string,
        viperId: string,
        currentViperId: string,
        comment: string
    ): Promise<WithId<Viper> | null>
    addFeedCommentedBlog(
        blogId: string,
        viperId: string,
        currentViperId: string
    ): Promise<WithId<Viper> | null>
}

interface ViperEventRepository {
    toggleLikedEvent(
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
    ): Promise<WithId<Viper> | null>
    addCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null>
    removeCreatedEvent(viperId: string, eventId: string): Promise<WithId<Viper> | null>
    // wonder if we should return an empty[] if it does not have any event
    getCreatedEvents(viperId: string): Promise<CreatedEvent[]>
}

export type TViperRepository = ViperCRUDRepository &
    ViperFollowRepository &
    ViperBlogRepository &
    ViperEventRepository
