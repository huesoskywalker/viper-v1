"use client"

import { ApolloLink, HttpLink, SuspenseCache, split } from "@apollo/client"
import { getMainDefinition } from "@apollo/client/utilities"
import {
    ApolloNextAppProvider,
    NextSSRInMemoryCache,
    NextSSRApolloClient,
    SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"
import { WebSocket } from "ws"
import { setVerbosity } from "ts-invariant"
// setVerbosity("debug")

function makeClient() {
    const httpLink = new HttpLink({
        uri: "http://localhost:4000/graphql",
        fetchOptions: { cache: "no-store" },
    })

    const wsLink = new GraphQLWsLink(
        createClient({
            url: "ws://localhost:4000/graphql/subscriptions",
            webSocketImpl: WebSocket,
        })
    )
    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query)
            return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
            )
        },
        wsLink,
        httpLink
    )

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([new SSRMultipartLink({ stripDefer: true }), splitLink])
                : splitLink,
    })
}

function makeSuspenseCache() {
    return new SuspenseCache()
}

export function ApolloWrapper({ children }) {
    return (
        <ApolloNextAppProvider makeClient={makeClient} makeSuspenseCache={makeSuspenseCache}>
            {children}
        </ApolloNextAppProvider>
    )
}
