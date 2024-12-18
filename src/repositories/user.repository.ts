import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryBase } from 'src/_core/repository.base';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class UserRepository extends RepositoryBase<User> {
  constructor(
    @InjectRepository(User)
    public repository: Repository<User>,
  ) {
    super(repository);
  }
}
