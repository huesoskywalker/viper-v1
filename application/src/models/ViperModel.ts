import { IViperRepository } from "@/types/viper"

export class ViperModel {
    constructor(private viperRepository: IViperRepository) {}
    async getById(viperId: string) {
        try {
            await this.viperRepository.getById(viperId)
        } catch (error: unknown) {
            throw new Error(`Model Error: Failed to retrieve Viper by Id ${error}`)
        }
    }
}
