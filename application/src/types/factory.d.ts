import { EventRepository } from "@/repositories/EventRepository"
import { ViperRepository } from "@/repositories/ViperRespository"

export type TRepositoryFactory = {
    initializeRepositories(): IInitializeRepositories
}

export type InitializeRepositories = {
    viperRepository: ViperRepository
    eventRepository: EventRepository
}
