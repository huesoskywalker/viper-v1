import "@shopify/shopify-api/adapters/node"
import {
    shopifyApi,
    LATEST_API_VERSION,
    ApiVersion,
} from "@shopify/shopify-api"
import { restResources } from "@shopify/shopify-api/rest/admin/2023-01"

export const shopifyAdmin = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY || "69219fbe4ec26f26442a47b77f490b04",
    apiSecretKey: "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", // Note: this is the API access token, NOT the API Secret Key
    apiVersion: ApiVersion.January23 || LATEST_API_VERSION,
    isCustomStoreApp: true, // this MUST be set to true (default is false)
    scopes: process.env.SHOPIFY_SCOPES?.split(",") || [
        "write_products",
        "read_products",
    ],
    isEmbeddedApp: false,
    hostScheme: "https",
    hostName: process.env.SHOPIFY_HOST || "vipers-go.myshopify.com",
    // Mount REST resources.
    restResources,

    privateAppStorefrontAccessToken:
        process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
        "259a9b2beca8d532d726aa6830179d11",
})
