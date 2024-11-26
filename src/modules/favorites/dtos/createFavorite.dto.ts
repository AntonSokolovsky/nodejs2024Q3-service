import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({
    example: 'c1b75b56-e8a3-4a69-993f-9b11f2c60f4d',
    description: 'Favorite id',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'artist',
    description: 'Favorite type',
  })
  @IsEnum(['artist', 'album', 'track'])
  type: 'artist' | 'album' | 'track';
}
