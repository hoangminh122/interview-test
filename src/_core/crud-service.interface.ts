/* eslint-disable @typescript-eslint/no-explicit-any */

import { TCurrentUser } from 'src/utils/decorators/current-user.decorator';
import { DeepPartial } from 'typeorm';

export interface ICRUDService<Entity> {
  create?(
    payload: Record<string, any>,
    currentUser: TCurrentUser,
  ): Promise<DeepPartial<Entity>>;

  deleteById?(id: number, currentUser: TCurrentUser): Promise<void>;

  findMany?(
    queryParams: Record<string, any>,
    currentUser: TCurrentUser,
  ): Promise<DeepPartial<Entity>>;

  findOneById?(
    id: number,
    currentUser: TCurrentUser,
  ): Promise<DeepPartial<Entity>>;

  updateById?(
    id: number,
    payload: Record<string, any>,
    currentUser: TCurrentUser,
  ): Promise<void>;
}
