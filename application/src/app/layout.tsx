import "./globals.css"
import type { ReactNode } from "react"
import AuthProvider from "./_components/AuthProvider"
import GlobalNav from "./_components/GlobalNav"
import { MongoDBConnection } from "@/config/MongoDBConnection"
import { RepositoryFactory } from "@/repositories/RepositoryFactory"
import { EventRepository } from "@/repositories/EventRepository"
import { EventService } from "@/services/EventService"

export default async function RootLayout({ children }: { children: ReactNode }) {
    const database = await MongoDBConnection.getInstance()
    const viperDb = database.getViperDatabase()

    const factoryInstance = RepositoryFactory.getInstance()

    const { eventRepository, viperRepository } = factoryInstance.initializeRepositories(viperDb)
    const eventService = new EventService(eventRepository)

    return (
        <html>
            <body className="overflow-y-scroll bg-gray-900">
                <AuthProvider>
                    <GlobalNav />
                    <div className="xl:pl-44 lg:pl-40 md:pl-32">
                        <div className="mx-auto max-w-4xl px-2 pt-20 pb-8 lg:p-8 md:p-5">
                            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                                <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
                            </div>
                        </div>
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
