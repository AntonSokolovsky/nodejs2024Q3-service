import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

interface ICreateArtistDto {
  name: string;
  grammy: boolean;
}

export class CreateArtistDto implements ICreateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
