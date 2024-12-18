/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IResponse<T> {
  data: T;
  success: boolean;
}

export interface IWCTResponse<T> extends IResponse<T> {
  errorMessage: string | null;
  errorMessageCode: string | null;
  status: number | null;
  statusText: string | null;
}
