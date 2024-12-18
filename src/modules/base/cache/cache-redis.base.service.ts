import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { onModuleInit } from 'src/utils/configs/redis.config';

import { LoggerService } from '../logger/logger.base.service';

@Injectable()
export class CacheRedisService extends LoggerService implements OnModuleInit {
  private client: Redis;

  async onModuleInit() {
    this.client = await onModuleInit();
  }

  isRedisConnected() {
    if (this.client && ['connecting', 'ready'].includes(this.client.status)) {
      return true;
    }
    return false;
  }

  async get(key: string): Promise<object | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null; // Parse JSON back to object
    } catch (err) {
      this.error({
        errorMessage: err.message,
        success: false,
      });
    }
  }

  getTtl(key: string) {
    return this.client.ttl(key);
  }

  async set(key: string, object: object, ttl?: number) {
    try {
      if (ttl) {
        await this.client.set(key, JSON.stringify(object));
        await this.client.expire(key, ttl);
      } else {
        await this.client.set(key, JSON.stringify(object));
      }
    } catch (err) {
      this.error({
        errorMessage: err.message,
        success: false,
      });
    }
  }

  async del(key: string) {
    try {
      await this.client.del(key);
    } catch (err) {
      this.error({
        errorMessage: err.message,
        success: false,
      });
    }
  }
}
