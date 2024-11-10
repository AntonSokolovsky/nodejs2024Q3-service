import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

interface IUpdateArtistDto {
  name: string;
  grammy: boolean;
}

export class UpdateArtistDto implements IUpdateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
