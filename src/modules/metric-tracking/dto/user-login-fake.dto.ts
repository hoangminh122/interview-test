import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserLoginFakeDto {
    @ApiProperty()
    @IsUUID()
    userIdLoginFake: string;
}