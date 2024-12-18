import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FetchUtil } from './fetch.util';
import { TimeUtil } from './time.util';
import { Util } from './util';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT') || 10000,
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS') || 3,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [Util, TimeUtil, FetchUtil],
  exports: [Util, TimeUtil, FetchUtil],
})
export class UtilsModule { }
