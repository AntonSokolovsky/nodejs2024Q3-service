import { IsUUID, IsEnum } from 'class-validator';

export class CreateFavoriteDto {
  @IsUUID()
  id: string;

  @IsEnum(['artist', 'album', 'track'])
  type: 'artist' | 'album' | 'track';
}
