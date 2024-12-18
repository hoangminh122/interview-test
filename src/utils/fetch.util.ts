import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class FetchUtil {
  constructor(private readonly httpService: HttpService) {}

  get(url: string, config?: AxiosRequestConfig) {
    return this.httpService.axiosRef.get(url, config);
  }

  setAuthHeader(token: string) {
    this.httpService.axiosRef.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return this.httpService.axiosRef.post(url, data, config);
  }
}
