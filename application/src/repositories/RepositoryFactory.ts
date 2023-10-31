import { Db } from "mongodb"
import { ViperRepository } from "./ViperRespository"
import { InitializeRepositories, TRepositoryFactory } from "@/types/factory"
import { EventRepository } from "./EventRepository"

export class RepositoryFactory implements TRepositoryFactory {
    private static instance: RepositoryFactory
    private constructor() {}
    static getInstance(): RepositoryFactory {
        try {
            if (!this.instance) {
                this.instance = new RepositoryFactory()
            }
            return this.instance
        } catch (error) {
            // Add winston logger
            throw new Error(`Failed to get the repository instance, ${error}`)
        }
    }

    initializeRepositories(database: Db): InitializeRepositories {
        if (!database) {
            throw new Error(`Database is not initialized in Repository Factory`)
        }
        try {
            const viperRepository = new ViperRepository(database)
            const eventRepository = new EventRepository(database)
            return { viperRepository, eventRepository }
        } catch (error: unknown) {
            throw new Error(`Failed to initialize the Repositories, ${error}`)
        }
    }
}
