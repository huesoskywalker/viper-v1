import { Address, Blog, Shopify, Viper, MyEvents, Follow, _ID } from "@/types/viper"

class ViperClass implements Viper {
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

    constructor(
        _id: _ID,
        address: Address,
        backgroundImage: string,
        biography: string,
        blog: Blog,
        email: string,
        emailVerified: null,
        name: string,
        image: string,
        location: string,
        shopify: Shopify,
        myEvents: MyEvents,
        followers: Follow[],
        follows: Follow[]
    ) {
        this._id = _id
        this.address = address
        this.backgroundImage = backgroundImage
        this.biography = biography
        this.blog = blog
        this.email = email
        this.emailVerified = emailVerified
        this.name = name
        this.image = image
        this.location = location
        this.shopify = shopify
        this.myEvents = myEvents
        this.followers = followers
        this.follows = follows
    }
}
