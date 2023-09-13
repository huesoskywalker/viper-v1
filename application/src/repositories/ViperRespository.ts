import { IViperRepository, Viper } from "@/types/viper"
import { Collection, Db, ObjectId } from "mongodb"

export class ViperRepository implements IViperRepository {
    private viperCollection: Collection<Viper>
    constructor(database: Db) {
        this.viperCollection = database.collection<Viper>("users")
    }
    async getById(viperId: string): Promise<Viper | null> {
        try {
            const viper = await this.viperCollection.findOne<Viper>({
                _id: new ObjectId(viperId),
            })
            return viper
        } catch (error) {
            // Add winston logger
            throw new Error(`Failed to retrieve Viper by Id, ${error}`)
        }
    }
}
