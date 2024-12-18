
import { PaginationQuery } from './pagination.dto';
import { IsString } from 'class-validator';

export class FilterQuery extends PaginationQuery {
  @IsString()
  search?: string;

  @IsString()
  sort?: string;
}
