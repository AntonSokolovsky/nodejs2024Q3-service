import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

interface IUpdateTrackDto {
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export class UpdateTrackDto implements IUpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsOptional()
  artistId: string | null;

  @IsUUID()
  @IsOptional()
  albumId: string | null;

  @IsInt()
  @Min(0)
  duration: number;
}
