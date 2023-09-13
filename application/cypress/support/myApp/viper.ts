import {
    Address,
    Blog,
    MyEvents,
    Shopify,
    Viper,
    ViperBasicProps,
    Hex24String,
} from "@/types/viper"

export type ID = {
    [key: string]: string
}

export type _ID = {
    _id: Hex24String
}

export const address: Address = {
    phone: null,
    address: "",
    city: "",
    province: "",
    zip: null,
    country: "",
}

export const blog: Blog = {
    myBlog: [],
    likes: [],
    commented: [],
    rePosts: [],
}

export const myEvents: MyEvents = {
    _id: "",
    created: [],
    collection: [],
    likes: [],
}

export const shopify: Shopify = {
    customerAccessToken: "",
    customerId: "",
}

export const rawViper: Viper = {
    _id: "",
    address: address,
    backgroundImage: "",
    biography: "",
    blog: blog,
    email: "",
    emailVerified: null,
    name: "",
    image: "",
    location: "",
    shopify: shopify,
    myEvents: myEvents,
    followers: [],
    follows: [],
}

export const rawViperId: ID = {
    _id: "",
}

export const rawViperBasicProps: ViperBasicProps = {
    _id: "",
    name: "",
    image: "",
    backgroundImage: "",
    email: "",
    location: "",
    biography: "",
    followers: [],
    follows: [],
}
