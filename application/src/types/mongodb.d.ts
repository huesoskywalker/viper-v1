import { MongoDBConnection } from "@/config/MongoDBConnection"
import { MongoClient } from "mongodb"

declare global {
    var _mongoClientPromise: Promise<MongoClient>
}

export type TMongoDBConnection = {
    getViperDatabase(): Db
}
