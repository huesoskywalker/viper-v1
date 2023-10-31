import { EventRepository } from "@/repositories/EventRepository"
import { ViperRepository } from "@/repositories/ViperRespository"
import { Db } from "mongodb"

export type TRepositoryFactory = {
    initializeRepositories(database: Db): IInitializeRepositories
}

export type InitializeRepositories = {
    viperRepository: ViperRepository
    eventRepository: EventRepository
}
