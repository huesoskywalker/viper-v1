import { TPreloadViperService } from '@/types/viper'
import { ViperService } from './ViperService'

export class PreloadViperService implements TPreloadViperService {
   private viperService: ViperService
   constructor(viperService: ViperService) {
      this.viperService = viperService
   }
   async preloadGetById(viperId: string): Promise<void> {
      void (await this.viperService.getById(viperId))
   }

   async preloadBasicProps(viperId: string): Promise<void> {
      void (await this.viperService.getBasicProps(viperId))
   }
}
