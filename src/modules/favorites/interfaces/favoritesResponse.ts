import { Album } from 'src/entities/album.entity';
import { Artist } from 'src/entities/artist.entity';
import { Track } from 'src/entities/track.entity';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
