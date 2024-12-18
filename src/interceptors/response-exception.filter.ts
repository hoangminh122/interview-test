import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { Response } from 'express';
import { last } from 'lodash'
import { logger } from 'nestjs-i18n';
import { IErrorResponse } from 'src/utils/response/error-response';

dotenvConfig({ path: '.env' });
@Catch(HttpExceptionFilter)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // HttpException
    const errorMessage: string = exception.message;
    const errorMessageCode = last(errorMessage?.split('.'));

    const result: IErrorResponse<null> = {
      success: false,
      errorMessage,
      errorMessageCode: errorMessageCode,
      data: null,
    };

    logger.error(result);
    response.status(status).json(result);
  }
}
