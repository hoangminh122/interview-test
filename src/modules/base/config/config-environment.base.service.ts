import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

import { APP_CONFIG } from '../../../utils/configs/app.config';

@Injectable()
export class ConfigEnvironmentService {
  private static configService: ConfigService;
  constructor(configService: ConfigService) {
    ConfigEnvironmentService.configService = configService;
  }

  static get(key: string) {
    if (ConfigEnvironmentService.isEnvKeySatisfied(key)) {
      return ConfigEnvironmentService.configService.get<string>(key);
    }
  }

  get(key: string) {
    if (ConfigEnvironmentService.isEnvKeySatisfied(key)) {
      return ConfigEnvironmentService.configService.get<string>(key);
    }
  }

  // Check env key exists in system
  static isEnvKeySatisfied(key: string) {
    return Object.keys(APP_CONFIG).includes(key);
  }

  // Check env key exists in system
  static isEnvValuesIsNil(key: string) {
    return isNil(APP_CONFIG[key]);
  }

  public static getIns() {
    if (!ConfigEnvironmentService.configService) {
      ConfigEnvironmentService.configService = new ConfigService(APP_CONFIG);
    }

    return ConfigEnvironmentService.configService;
  }
}
