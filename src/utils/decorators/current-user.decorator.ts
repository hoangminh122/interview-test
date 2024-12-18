import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/repositories/entities/user.entity';
import { SYSTEM_ERROR_CODE } from 'src/utils/constants/system.constant';

export type TCurrentUser = Pick<User, 'id'>;

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req?.user) {
      throw new InternalServerErrorException(SYSTEM_ERROR_CODE.EXH.EXH_ERR_001);
    }

    return { id: parseInt(req.user.userId, 10) };
  },
);
