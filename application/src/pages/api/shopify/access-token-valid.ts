import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const customerId = "6878490525986"
    const customerId = "gid://shopify/Customer/6878490525986"
    // https://vipers-go.myshopify.com/admin/customers/search.json?query=huesoskywalker%40gmail.com
    const endpoint = `https://vipers-go.myshopify.com/admin/customers/${customerId}/access_tokens.json`

    const a = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": "58b359ccab40d291367e9c5422a7cc7d",
        },
        body: JSON.stringify({
            access_token: {
                title: "Custom App",
                expires_at: "2030-04-28T17:00:00-04:00",
            },
        }),
    })
    const b = await a.json()
    console.log(b)
}
