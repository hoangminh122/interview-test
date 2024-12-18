import { Global, Module } from '@nestjs/common';

import { CacheRedisService } from './cache-redis.base.service';

@Global()
@Module({
  providers: [CacheRedisService],
  exports: [CacheRedisService],
})
export class CacheRedisModule {}
