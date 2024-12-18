import Redis from 'ioredis';
import { logger } from 'nestjs-i18n';
import { ConfigEnvironmentService } from 'src/modules/base/config/config-environment.base.service';

export const onModuleInit = async () => {
  const client = new Redis({
    host: ConfigEnvironmentService.getIns().get('REDIS_HOST'),
    port: ConfigEnvironmentService.getIns().get('REDIS_PORT'),
    password: ConfigEnvironmentService.getIns().get('REDIS_PASSWORD'),
    // tls: {},
    retryStrategy(times) {
      const delay = Math.min(times * 100, 20000);
      return delay;
    },
    // disconnectTimeout: 10000,
    maxRetriesPerRequest: 2,
  });
  client.on('error', (err) => {
    if (
      ![1, true, 'true'].includes(
        ConfigEnvironmentService.getIns().get('REDIS_ENABLE'),
      )
    ) {
      client.disconnect();
    }
    logger.error({
      errorMessage: err.message,
      success: false,
    });
  });
  return await client;
};
