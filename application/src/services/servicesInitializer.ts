import { MongoDBConnection } from '@/config/MongoDBConnection'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import { EventService } from '@/services/EventService'
import { ViperService } from '@/services/ViperService'
import { PreloadViperService } from './PreloadViperService'

const database = await MongoDBConnection.getInstance()
const viperDb = database.getViperDatabase()

const factoryInstance = RepositoryFactory.getInstance()

const { eventRepository, viperRepository } = factoryInstance.initializeRepositories(viperDb)

const eventService = new EventService(eventRepository)

const viperService = new ViperService(viperRepository)

const preloadViperService = new PreloadViperService(viperService)

export { eventService, viperService, preloadViperService }
