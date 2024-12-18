import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import typeormConfig from 'src/utils/configs/typeorm.config';
import { NODE_ENV } from 'src/utils/enums/common.enum';

import { ConfigEnvironmentService } from './config-environment.base.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(Object.values(NODE_ENV).join(','))
          .default(NODE_ENV.DEVELOP),
        PORT: Joi.number().port().default(3000),
      }),
      isGlobal: true,
      validationOptions: {
        abortEarly: true,
      },
      load: [typeormConfig],
    }),
  ],
  controllers: [],
  providers: [ConfigEnvironmentService],
})
export class ConfigEnvironmentModule {}
