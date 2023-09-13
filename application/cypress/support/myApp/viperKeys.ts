import { Address, MyBlog, Viper, ViperBasicProps } from "@/types/viper"

import { ID } from "./viper"

export const _idKey: (keyof ID)[] = ["_id"]

export const addressKeys: (keyof Address)[] = [
    "phone",
    "address",
    "city",
    "province",
    "zip",
    "country",
]

export const myBlogKeys: (keyof MyBlog)[] = [
    "_id",
    "content",
    "likes",
    "comments",
    "rePosts",
    "timestamp",
]

export const viperKeys: (keyof Viper)[] = [
    "_id",
    "address",
    "backgroundImage",
    "biography",
    "blog",
    "email",
    "emailVerified",
    "name",
    "image",
    "location",
    "shopify",
    "myEvents",
    "followers",
    "follows",
]

export const viperBasicKeys: (keyof ViperBasicProps)[] = [
    "_id",
    "name",
    "image",
    "backgroundImage",
    "email",
    "location",
    "biography",
    "followers",
    "follows",
]
