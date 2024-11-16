import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

interface ICreateUserDto {
  login: string;
  password: string;
}

export class CreateUserDto implements ICreateUserDto {
  @ApiProperty({
    example: 'Peter',
    description: 'User name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'password',
    description: 'User password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
