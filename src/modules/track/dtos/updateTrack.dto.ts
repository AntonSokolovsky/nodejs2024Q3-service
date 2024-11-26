import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Track',
    description: 'Track name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'c1b75b56-e8a3-4a69-993f-9b11f2c60f4d',
    description: 'Artist id in UUID format',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  artistId: string | null;

  @ApiProperty({
    example: 'c1b75b56-e8a3-4a69-993f-9b11f2c60f4d',
    description: 'Album id in UUID format',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  albumId: string | null;

  @ApiProperty({
    example: 5,
    description: 'Track duration',
    required: true,
  })
  @IsInt()
  @Min(0)
  duration: number;
}
