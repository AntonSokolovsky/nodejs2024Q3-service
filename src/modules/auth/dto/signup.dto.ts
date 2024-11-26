import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
