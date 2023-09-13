import { ObjectId } from "mongodb"

export interface Viper {
    readonly _id: _ID
    address: Address
    backgroundImage: string
    biography: string
    blog: Blog
    email: string
    emailVerified: null
    name: string
    image: string
    location: string
    shopify: Shopify
    myEvents: MyEvents
    followers: Follow[]
    follows: Follow[]
}
export interface MyEvents {
    readonly _id: _ID
    created: Created[]
    collection: Collection[]
    likes: Likes[]
}
export interface Created {
    readonly _id: _ID
}
export interface Collection {
    readonly _id: _ID
    readonly checkoutId: string
}
export interface Likes {
    readonly _id: _ID
}
export interface Follow {
    readonly _id: _ID
}
export interface Address {
    phone: number | null | string
    address: string
    province: string
    country: string
    zip: number | null | string
    city: string
}

export interface Blog {
    myBlog: MyBlog[]
    likes: ExternalBlog[]
    commented: ExternalBlog[]
    rePosts: ExternalBlog[]
}

export interface MyBlog {
    readonly _id: _ID
    content: string
    likes: Likes[]
    comments: string[]
    rePosts: string[]
    timestamp: number
}
export interface ExternalBlog {
    readonly _id: _ID
    readonly blogOwner_id: _ID
    readonly viper_id: _ID
    comment?: string
    timestamp: number
}

export interface Chats {
    readonly _id: _ID
    members: _ID[]
    messages: Message[]
}
export interface Message {
    readonly _id: _ID
    sender: _ID
    message: string
    timestamp: number
}

export interface Sender {
    readonly _id: _ID
    name: string
}
export interface Shopify {
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
    | "location"
    | "biography"
    | "followers"
    | "follows"
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

export type _ID = ObjectId | Hex24String
