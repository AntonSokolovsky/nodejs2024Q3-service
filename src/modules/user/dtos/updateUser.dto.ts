import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

interface IUpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class UpdateUserDto implements IUpdatePasswordDto {
  @ApiProperty({
    description: 'Old user password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New user password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
