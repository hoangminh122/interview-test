import { BadRequestException } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { Brackets, QueryBuilder, SelectQueryBuilder } from 'typeorm';

import { DEFAULT_EXCLUDE_QUERY_PARAMS } from './constants/common.constant';
import { SYSTEM_ERROR_CODE } from './constants/system.constant';
import { SORT_DIRECTIONS } from './enums/common.enum';
import { FilterQuery } from './paginate-and-filter/filter.dto';
import { Pagination } from './interfaces/success-response';
import { SortDirection } from './interfaces/common.interface';

export const SQL_SPECIAL_OPERATIONS_MAPPING = {
  '=': '=',
  '<': '<',
  '>': '>',
  '>=': '>=',
  '<=': '<=',
  like: 'LIKE',
  '!=': 'IS NOT',
};


export interface IAliasMapping {
  [key: string]: string;
}

// The query requires the request query and alias mapping, each endpoint has its own alias mapping
export class QueryHandlerBuilder<
  Entity,
  T extends FilterQuery,
> extends SelectQueryBuilder<Entity> {
  private readonly query: T;
  private readonly aliasMapping: IAliasMapping;
  private paging: Pagination;

  constructor(
    queryBuilder: QueryBuilder<Entity>,
    query: T,
    aliasMapping: IAliasMapping,
  ) {
    super(queryBuilder);

    // prevent reconstruct when calling new Bracket(factory function)
    if (!aliasMapping) {
      return;
    }

    this.aliasMapping = aliasMapping;
    this.query = this.mappingFilterParamsToTableCols(query);

    // Init paginate
    this.initPaginate();
  }

  //
  // Mapping user's request query params to table columns
  mappingFilterParamsToTableCols(query: T) {
    if (!query) {
      return null;
    }

    const filteredQuery = pick(query, [
      ...Object.keys(this.aliasMapping),
      ...DEFAULT_EXCLUDE_QUERY_PARAMS,
    ]) as T;

    const mappedQuery = {};
    Object.entries(filteredQuery).forEach(([key, value]) => {
      mappedQuery[this.aliasMapping[key] || key] = value;
    });

    return mappedQuery as T;
  }


  //
  // Search text (from user's request query) by specific searchFields. Eg: searchFields = ['id', 'description']
  search(searchFields: string[] = []) {
    if (!this.query?.search || !searchFields.length) {
      return this;
    }

    const mappedSearchField = searchFields.map(
      (param) => this.aliasMapping[param],
    );

    this.andWhere(
      new Brackets((qb) => {
        mappedSearchField.forEach((f) => {
          qb.orWhere(`${f} LIKE :s`, { s: `%${this.query.search}%` });
        });
      }),
    );

    return this;
  }

  //
  // Filter by params in request query. Eg: ?amount=250&createdDate[>=]=2024-09-14&&createdDate[<=]=2024-11-05
  filter(extraExcludeQueryParams: string[] = []) {
    if (!this.query) {
      return this;
    }

    // Remove special param filters from request query before filtering: sort, search, select, page, limit
    const query = omit(this.query, [
      ...DEFAULT_EXCLUDE_QUERY_PARAMS,
      ...extraExcludeQueryParams.map((param) => this.aliasMapping[param]),
    ]);

    // Nothing to filter
    if (!Object.keys(query).length) {
      return this;
    }

    //
    // Eg:
    // query has the form: {userId: 5, checkoutId: {'<': 10, '>=': 5}}:
    // - queryField = 'userId' and 'queryValue' = 5
    // - queryField = 'checkoutId' và 'queryValue' = {'<': 10, '>=': 5}
    Object.keys(query).forEach((queryField) => {
      const queryValue: Record<string, string | number | object> =
        query[queryField];

      //
      // Eg case queryValue !== object:
      // userId: 5
      if (typeof queryValue !== 'object') {
        this.andWhere(`${queryField} = :${queryField}`, {
          [queryField]: queryValue,
        });
      }

      //
      // Eg case queryValue === object
      // checkoutId: {'<': 10, '>=': 5}
      else {
        Object.keys(queryValue).forEach((operation, idx) => {
          operation = SQL_SPECIAL_OPERATIONS_MAPPING[operation] || operation;

          const alias = `${queryField}_${idx}`;
          const operationValue = queryValue[operation];

          // operationValue is invalid
          if (typeof operationValue === 'number' && isNaN(operationValue)) {
            // throw new BadRequestException(`Invalid number value for ${queryField}[${operation}]`);
            return;
          }

          if (operationValue.toString() === `Invalid Date`) {
            // throw new BadRequestException(`Invalid date for ${queryField}[${operation}]`);
            return;
          }

          // where
          this.andWhere(`${queryField} ${operation} :${alias}`, {
            [alias]: operationValue,
          });
        });
      }
    });

    return this;
  }

  // Multi sorting using sort params
  // Eg: ?sort=amount:asc&createdDate:desc
  sort() {
    // Nothing to sort
    if (!this.query?.sort) {
      return this;
    }

    //
    // Eg: sortFields = [amount:asc, createdDate:desc]
    const sortFields = this.query.sort.split(',');

    sortFields.forEach((f) => {
      // Eg: fieldName=amount:asc or createdDate:desc
      const [fieldName, direction] = f.split(':');

      if (
        direction.toUpperCase() === SORT_DIRECTIONS.ASC ||
        direction.toUpperCase() === SORT_DIRECTIONS.DESC
      ) {
        // mapping user's request query params to table columns
        // Eg: amount -> table_name.amount
        const mappedFieldName = this.aliasMapping[fieldName];

        if (!mappedFieldName) {
          throw new BadRequestException("Invalid parameter");
        }

        this.addOrderBy(
          `${mappedFieldName}`,
          direction.toUpperCase() as SortDirection,
        );
      }
    });

    return this;
  }

  initPaginate() {
    // Nothing to paging
    if (!this.query) {
      return;
    }

    // Page and limit is in invalid format
    if (isNaN(this.query.page) || isNaN(this.query.limit)) {
      return;
    }

    this.offset((this.query.page - 1) * this.query.limit);
    this.limit(this.query.limit);

    // set pagination
    this.paging = {
      maxPerPage: Number(this.query.limit),
      pageNumber: Number(this.query.page),
      totalItem: 0,
      totalPage: 0,
    };

    return this;
  }

  paginate(
    data: Array<Entity> | Array<any>,
    totalItem: number,
  ): { data: Array<Entity> | Array<any>; paging: Pagination } {
    this.paging.totalItem = totalItem;
    this.paging.totalPage = Math.ceil(totalItem / this.paging.maxPerPage);

    if (
      this.paging.pageNumber > this.paging.totalPage &&
      this.paging.totalPage !== 0
    ) {
      throw new BadRequestException("Page number invalid");
    }

    return {
      data: data,
      paging: this.paging,
    };
  }
}
