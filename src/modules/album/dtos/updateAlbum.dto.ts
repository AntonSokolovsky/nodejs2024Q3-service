import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

interface IUpdateAlbumDto {
  name: string;
  year: number;
  artistId: string | null;
}

export class UpdateAlbumDto implements IUpdateAlbumDto {
  @ApiProperty({
    example: 'Album',
    description: 'Album name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 2024,
    description: 'Album release year',
    required: true,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    example: 'c1b75b56-e8a3-4a69-993f-9b11f2c60f4d',
    description: 'Artist id',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  artistId: string | null;
}
