import { IResponse } from './response.interface';

export type Pagination = {
  maxPerPage: number;
  pageNumber: number;
  totalItem: number;
  totalPage: number;
};

export interface ISuccessResponse<T> extends IResponse<T> {
  data: T;
  success: boolean;
}

export interface ISuccessResponsePaginate<T> extends IResponse<T> {
  data: T;
  paging: Pagination;
  success: boolean;
}
