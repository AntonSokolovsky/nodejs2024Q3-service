import { IsString, ValidateIf } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  readonly refreshToken: string;
}
