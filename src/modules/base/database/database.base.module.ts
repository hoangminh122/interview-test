import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_CONFIG } from 'src/utils/configs/typeorm.config';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forRoot(TYPEORM_CONFIG)],
})
export class DatabaseModule {}
