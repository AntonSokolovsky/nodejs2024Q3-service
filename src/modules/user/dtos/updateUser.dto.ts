import { IsNotEmpty, IsString } from 'class-validator';

interface IUpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class UpdateUserDto implements IUpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
