import { DeleteResult, ObjectId } from "mongodb"

export type Viper = {
    readonly _id: _ID
    address: Address
    backgroundImage: Image
    biography: Biography
    blog: Blog
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
    created: Created[]
    collection: Collection[]
    likes: Likes[]
}
export type Created = {
    readonly _id: _ID
}
export type Collection = {
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
    myBlog: MyBlog[]
    likes: ExternalBlog[]
    commented: ExternalBlog[]
}

export type MyBlog = {
    readonly _id: _ID
    content: string
    likes: Likes[]
    comments: string[]
    timestamp: number
}
export type ExternalBlog = {
    readonly _id: _ID
    readonly blogOwner_id: _ID
    readonly viper_id: _ID
    comment?: string
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

// export type Hex24String = `${
//     | "0"
//     | "1"
//     | "2"
//     | "3"
//     | "4"
//     | "5"
//     | "6"
//     | "7"
//     | "8"
//     | "9"
//     | "a"
//     | "b"
//     | "c"
//     | "d"
//     | "e"
//     | "f"}{24}`
export type Hex24String = string & { length: 24 }

export type _ID = ObjectId | Hex24String
export type UploadViperImage = {
    data: { url } | null
    error: string | null
}

export interface IViperRepository {
    getAll(): Promise<Viper[]>
    getById(viperId: string): Promise<Viper | null>
    getBasicPropsById(viperId: string)
    // This is one below is built for the search input
    findByUsername(username: string): Promise<Viper[] | null>
    getEventsCollection(viperId: string): Promise<Collection[]>
    getLikedEvents(viperId: string): Promise<Likes[]>
    getFollows(viperId: string): Promise<Follow[]>
    // check in this function we are using the currentViper, we can handle it better than this
    // in the name and most probably use the session we've got or might it be cool that way
    // getViperFollowById, also this name convention is more convenient
    // And we should make it the other way, check inside our followers if we already follow him
    isViperFollowed(viperId: string): Promise<boolean>
    isEventParticipationRequested(viperId: string, eventId: string): Promise<boolean>
    getBlogs(viperId: string): Promise<Blog[]>
    createBlog(viperId: string, comment: string): Promise<ModifyResult<Viper>>
    // We can do it better in here also, divide it into 2 different functions maybe?
    // this function looks awful, let's make it different if we can likeBlog and updateBlog
    likeBlog(
        blogOwnerId: string,
        _id: string,
        viperId: string
    ): Promise<[ModidfyResult<Viper>, ModifyResult<Viper>]>
    // check in here if we should pass the ids and then transform them as array with the EventRepository
    getEventsCreated(viperId: string): Promise<Eventtype[] | null>
    updateProfile(viper: UpdateViperType): Promise<ModifyResult<Viper>>
    // In here also, we should make a addFollow and addFollower and split into a better instance of it
    // same we do have the initChat in here so we should perform something to add a request to chat, and create the instance
    addFollow(
        viperId: string,
        currentViper: string
    ): Promise<[ModifyResult<Viper>, ModifyResult<Viper>]>
    // let's make a better name to the _id, blogId?
    addCommentToBlog(
        blogOwnerId: string,
        _id: string,
        viperId: string,
        comment: string
    ): Promise<ModifyResult<Viper>>
    requestEventParticipation(
        viperId: string,
        eventId: string,
        checkoutId: string
    ): Promise<ModifyResult<Viper>>
    // check the name convention, we make it different because of the EventRepository, for now
    toggleLikeEvent(
        viperId: string,
        eventId: string,
        operation: string
    ): Promise<ModifyResult<Viper>>
    addOrganizedEvent(viperId: string, eventId: string): Promise<ModifyResult<Viper>>
    removeOrganizedEvent(viperId: string, eventId: string): Promise<ModifyResult<Viper>>
}
