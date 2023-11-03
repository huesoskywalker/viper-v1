import { Db, MongoClient, MongoClientOptions, MongoError } from 'mongodb'
import { winstonLogger } from './winstonLogger'
import { TMongoDBConnection } from '@/types/mongodb'

const uri: string = process.env.MONGODB_URI as string
const options: MongoClientOptions = {}

export class MongoDBConnection implements TMongoDBConnection {
   private static instance: MongoDBConnection
   private client: MongoClient
   private clientPromise: Promise<MongoClient>

   private constructor() {
      this.client = new MongoClient(uri, options)
      this.clientPromise = this.client.connect()
   }

   static getInstance(): MongoDBConnection {
      try {
         if (!this.instance) {
            if (!process.env.MONGODB_URI) {
               throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
            }
            this.instance = new MongoDBConnection()
         }
         return this.instance
      } catch (error: unknown) {
         if (error instanceof MongoError) {
            winstonLogger.error(
               `Database initialization failed code: ${error.code}, error ${error.name}: ${error.message}, cause: ${error.cause}`,
            )
         }
         throw new Error(`Database Initialization failed ${error}`)
      }
   }

   async getViperDatabase(): Promise<Db> {
      return (await this.clientPromise).db('viperDb')
   }
}
