import { InternalServerErrorException } from '@nestjs/common';
import { first } from 'lodash';
import { BASE_ENTITY_DOMAIN } from 'src/utils/constants/common.constant';
import { SYSTEM_ERROR_CODE } from 'src/utils/constants/system.constant';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectId,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export class RepositoryBase<Entity extends ObjectLiteral> {
  constructor(protected repository: Repository<Entity>) { }

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Entity> {
    const queryBuilder = this.repository.createQueryBuilder(alias, queryRunner);
    const hasDeletedAtColumn = this.repository.metadata.columns.some(
      (column: ColumnMetadata) =>
        column.propertyName === BASE_ENTITY_DOMAIN.BASE_COLUMNS.DELETED_AT,
    );
    if (!alias && hasDeletedAtColumn) {
      throw new InternalServerErrorException(SYSTEM_ERROR_CODE.INV.INV_ERR_010);
    }
    if (hasDeletedAtColumn) {
      queryBuilder.where(
        `${alias}.${BASE_ENTITY_DOMAIN.BASE_COLUMNS.DELETED_AT} IS NULL`,
      );
    }
    return queryBuilder;
  }

  insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    return this.repository.insert(entity);
  }

  async insertOne(entity: QueryDeepPartialEntity<Entity>): Promise<Entity> {
    const dataInserted = await this.repository.insert(entity);
    if (dataInserted) {
      const identifier = first(dataInserted.identifiers);
      return this.repository.findOneById(identifier.id);
    }
    return entity as Entity;
  }

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, partialEntity);
  }

  upsert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
    conflictPathsOrOptions: string[] | UpsertOptions<Entity>,
  ): Promise<InsertResult> {
    return this.repository.upsert(entityOrEntities, conflictPathsOrOptions);
  }

  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Entity>,
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
    return this.repository.findOne(options);
  }

  findOneById(id: number | string | Date | ObjectId): Promise<Entity | null> {
    return this.repository.findOneById(id);
  }

  async findMany(options?: FindManyOptions<Entity>): Promise<{
    count?: number;
    data: Array<Entity>;
  }> {
    const results = await this.repository.findAndCount(options);
    return { count: results[1], data: results[0] };
  }

  find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(options);
  }

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]> {
    return this.repository.save(entities, options);
  }

  softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Entity>,
  ): Promise<UpdateResult> {
    return this.repository.softDelete(criteria);
  }
}
