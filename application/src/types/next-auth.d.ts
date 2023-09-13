import { ObjectId } from "mongodb"
import NextAuth, { DefaultSession } from "next-auth"
import { Address, Shopify, Viper } from "./viper"

declare module "next-auth" {
    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface Session {
        user: {
            _id: string
            name: string
            email: string
            image: string
            location: string
            // biography: string
            // location: string
            // address: Address
            shopify: Shopify
            // we are not using the accessToken,, yet
            accessToken: string
            // customerAccessToken: string
        }
    }
    /**
     * Usually contains information about the provider being used
     * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
     */
    interface Account {}
    /** The OAuth profile returned from your provider */
    interface Profile {}
    interface Token {
        _id: string
        name: string
        email: string
        image: string
        // biography: string
        location: string
        // address: Address
        shopify: Shopify
        // we are not using the accessToken,, yet
        // accessToken: string
    }
    type User = Viper
    // old type
    // type User = {
    //     // if we use this _id probably we will get the ObjectId
    //     _id: string
    //     name: string
    //     email: string
    //     image: string
    //     location: Address
    //     // biography: string
    //     // address: Address
    //     shopify: Shopify
    //     // we are not using the accessToken,, yet
    // }
}
