import { MongoDBConnection } from "@/config/MongoDBConnection"
import { Db } from "mongodb"
import { ViperRepository } from "./ViperRespository"
import { InitializeRepositories, TRepositoryFactory } from "@/types/factory"
import { EventRepository } from "./EventRepository"

export class RepositoryFactory implements TRepositoryFactory {
    private static instance: RepositoryFactory
    private viperDatabase: Db
    private constructor(viperDatabase: Db) {
        this.viperDatabase = viperDatabase
    }
    static async getInstance(): Promise<RepositoryFactory> {
        try {
            if (!this.instance) {
                const dbConnection = await MongoDBConnection.getInstance()
                const viperDatabase = dbConnection.getViperDatabase()
                this.instance = new RepositoryFactory(viperDatabase)
            }
            return this.instance
        } catch (error) {
            // Add winston logger
            throw new Error(`Failed to initialize the Repositories, ${error}`)
        }
    }
    initializeRepositories(): InitializeRepositories {
        const viperRepository = new ViperRepository(this.viperDatabase)
        const eventRepository = new EventRepository(this.viperDatabase)
        return { viperRepository, eventRepository }
    }
}
