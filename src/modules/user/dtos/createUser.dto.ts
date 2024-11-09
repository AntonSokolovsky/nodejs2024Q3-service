import { IsNotEmpty, IsString } from 'class-validator';

interface ICreateUserDto {
  login: string;
  password: string;
}

export class CreateUserDto implements ICreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
