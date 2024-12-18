import { HttpException } from '@nestjs/common';
import {
  ISuccessResponse,
  ISuccessResponsePaginate,
  Pagination,
} from 'src/utils/interfaces/success-response';

import { IErrorResponse } from 'src/utils/response/error-response';

export class BaseController {
  successResponse<T>(data?: T): ISuccessResponse<T> {
    return {
      success: true,
      data: data ?? null,
    };
  }

  errorResponse<T>(error: HttpException): IErrorResponse<T> {
    throw error;
  }

  pagingResponse<T>(data: T, paging: Pagination): ISuccessResponsePaginate<T> {
    return {
      success: true,
      data,
      paging,
    };
  }
}
