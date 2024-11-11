import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  favorites,
  getArtistById,
  getTrackById,
  getAlbumById,
  getAllAlbums,
  getAllTracks,
  artists,
  albums,
  tracks,
} from '../../database/inMemoryDB';
import { CreateFavoriteDto } from './dtos/createFavorite.dto';
import { Album } from 'src/entities/album.entity';
import { Track } from 'src/entities/track.entity';
import { Artist } from 'src/entities/artist.entity';

@Injectable()
export class FavoritesService {
  async getAllFavorites() {
    return {
      artists: artists.filter((artist) =>
        favorites.artists.includes(artist.id),
      ),
      albums: albums.filter((album) => favorites.albums.includes(album.id)),
      tracks: tracks.filter((track) => favorites.tracks.includes(track.id)),
    };
  }

  async addFavorite({ id, type }: CreateFavoriteDto) {
    const entityExists = await this.validateEntityExists(type, id);
    if (!entityExists) {
      throw new UnprocessableEntityException(
        `${type} with id ${id} does not exist`,
      );
    }

    if (!favorites[type + 's'].includes(id)) {
      favorites[type + 's'].push(id);
    }

    return { message: `${type} with id ${id} added to favorites` };
  }

  async removeFavorite(id: string, type: 'artist' | 'album' | 'track') {
    const collection = favorites[type + 's'];
    if (!collection.includes(id)) {
      throw new NotFoundException(`${type} with id ${id} is not in favorites`);
    }

    favorites[type + 's'] = collection.filter((favId) => favId !== id);
  }

  async validateEntityExists(type: string, id: string) {
    let result: Artist | Track | Album;
    switch (type) {
      case 'artist':
        result = await getArtistById(id);
        break;
      case 'album':
        result = await getAlbumById(id);
        break;
      case 'track':
        result = await getTrackById(id);
        break;
      default:
        return false;
    }
    return !!result;
  }

  async handleEntityDeletion(id: string, type: 'artist' | 'album' | 'track') {
    this.removeFavorite(id, type);
    const tracks = await getAllTracks();
    const albums = await getAllAlbums();
    if (type === 'artist') {
      albums.forEach((album) => {
        if (album.artistId === id) album.artistId = null;
      });
      tracks.forEach((track) => {
        if (track.artistId === id) track.artistId = null;
      });
    } else if (type === 'album') {
      tracks.forEach((track) => {
        if (track.albumId === id) track.albumId = null;
      });
    }
  }
}
