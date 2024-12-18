import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';
import { config as dotenvConfig } from 'dotenv';
import { Request } from 'express';
import { ILogToTeamsService } from 'src/_core/logger-to-teams.interface';
import { EVENT_EMITTER_LISTEN } from 'src/utils/constants/event-emitter.constant';
import {
  CARD_TYPE_DEFAULT,
  COLOR_ERROR,
  CONTENT_TYPE_DEFAULT,
  SERVER_NAME,
  TITLE_ERROR,
} from 'src/utils/constants/logger.constant';
import { WEBHOOK_TEAMS_FOR } from 'src/utils/enums/logger.enum';

import { ConfigEnvironmentService } from '../config/config-environment.base.service';

dotenvConfig({ path: '.env' });

@Injectable()
export class LoggerToTeamsService implements ILogToTeamsService {
  constructor(private eventEmitter: EventEmitter2) {}

  async postMessageToPublicTeamsbyEvent(
    messageDetail: { api: string; message: string; title?: string },
    req?: Request,
  ): Promise<void> {
    await this.eventEmitter.emit(EVENT_EMITTER_LISTEN.LOGGER_MODULE.SEND_LOG_ERROR_TO_TEAMS, {
      messageDetail,
      req,
    });
  }

  async postMessageToPublicTeams(
    messageDetail: { api: string; message: string; title?: string },
    req?: Request,
  ): Promise<void> {
    await this.postMessageToTeams(messageDetail, WEBHOOK_TEAMS_FOR.PUBLIC, req);
  }
  async postMessageToDevopsTeams?(
    messageDetail: { api: string; message: string; title?: string },
    req?: Request,
  ): Promise<void> {
    await this.postMessageToTeams(messageDetail, WEBHOOK_TEAMS_FOR.DEVOPS, req);
  }

  private async postMessageToTeams(
    messageDetail: { api: string; message: string; title?: string },
    sendTeamsFor: WEBHOOK_TEAMS_FOR,
    req?: Request,
  ) {
    const title = messageDetail.title ? messageDetail.title : TITLE_ERROR;
    const titleFormat = `[${SERVER_NAME || 'WE-MASTER-TRADE-SERVER'}][${title}]`;

    try {
      messageDetail.api = messageDetail.api || req?.url;
      const card = {
        '@type': CARD_TYPE_DEFAULT,
        themeColor: COLOR_ERROR, // error
        summary: 'Send message to Teams',
        sections: [
          {
            activityTitle: titleFormat,
            text: JSON.stringify(messageDetail),
          },
        ],
      };

      const endpoint = `${ConfigEnvironmentService.getIns().get(sendTeamsFor)}`;
      await axios.post(endpoint, card, {
        headers: {
          'content-type': CONTENT_TYPE_DEFAULT,
        },
      });
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
