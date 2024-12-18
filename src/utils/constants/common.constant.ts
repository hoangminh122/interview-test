import { cloneDeep } from 'lodash';

const BASE_ENTITY_DOMAIN = {
  BASE_COLUMNS: {
    ID: 'id',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
    CREATED_BY: 'created_by',
    UPDATED_BY: 'updated_by',
    DELETED_AT: 'deleted_at',
    DELETED_BY: 'deleted_by',
  },
  METRIC_COLUMNS: {
    USER_ID: 'user_id',
    VALUE: 'value',
    TYPE: 'type',
    UNIT: 'unit',
    DATE: 'date',
  },
  USER_COLUMNS: {
    USERNAME: 'user_login',
    PASSWORD: 'user_pass',
    EMAIL: 'user_email',
    STATUS: 'user_status',
  },
} as const;

const TABLE_NAME_PREFIX = 'tracking_';

const TABLE_NAMES = {
  METRIC: 'metrics',
  USER: 'users',
} as const;

const TABLE_NAMES_WITH_PREFIX = (() => {
  const result = cloneDeep(TABLE_NAMES);
  Object.keys(TABLE_NAMES).forEach((nameTable: string) => {
    result[nameTable] = `${TABLE_NAME_PREFIX}${result[nameTable]}`;
  });
  return result;
})();

const DEFAULT_EXCLUDE_QUERY_PARAMS = [
  'lang',
  'search',
  'sort',
  'select',
  'page',
  'limit',
];

export {
  BASE_ENTITY_DOMAIN,
  TABLE_NAMES,
  TABLE_NAMES_WITH_PREFIX,
  DEFAULT_EXCLUDE_QUERY_PARAMS,
};
