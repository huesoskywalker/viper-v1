import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { expressMiddleware } from "@apollo/server/express4"
import { makeExecutableSchema } from "@graphql-tools/schema"
import express from "express"
import http from "http"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import cors from "cors"
import { json } from "body-parser"
import { typeDefs } from "./graphql/typeDefs/typeDefs"
import { resolvers } from "./graphql/resolvers/resolvers"
import * as dotenv from "dotenv"
async function main() {
    dotenv.config()
    const app = express()
    const httpServer = http.createServer(app)

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql/subscriptions",
    })

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    })

    const serverCleanup = useServer(
        {
            schema,
        },
        wsServer
    )

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),

            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        },
                    }
                },
            },
        ],
    })
    await server.start()

    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    }

    app.use("/graphql", cors<cors.CorsRequest>(corsOptions), json(), expressMiddleware(server))

    const PORT = 4000

    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve))

    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
}

main().catch((err) => console.log(err))
