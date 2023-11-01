import { Db, MongoClient, MongoClientOptions, MongoError } from "mongodb"
import { winstonLogger } from "./winstonLogger"
import { TMongoDBConnection } from "@/types/mongodb"

export class MongoDBConnection implements TMongoDBConnection {
    private static instance: MongoDBConnection
    private client: MongoClient

    private constructor(client: MongoClient) {
        this.client = client
    }

    static async getInstance(): Promise<MongoDBConnection> {
        try {
            if (!this.instance) {
                if (!process.env.MONGODB_URI) {
                    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
                }
                const uri: string = process.env.MONGODB_URI
                const options: MongoClientOptions = {}
                const client: MongoClient = new MongoClient(uri, options)
                await client.connect()
                this.instance = new MongoDBConnection(client)
            }
            return this.instance
        } catch (error: unknown) {
            if (error instanceof MongoError) {
                winstonLogger.error(
                    `Database initialization failed code: ${error.code}, error ${error.name}: ${error.message}, cause: ${error.cause}`
                )
            }
            throw new Error(`Database Initialization failed ${error}`)
        }
    }

    getViperDatabase(): Db {
        return this.client.db("viperDb")
    }
}
