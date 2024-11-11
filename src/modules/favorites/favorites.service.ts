import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  favorites,
  // artists,
  // albums,
  // tracks,
  getArtistById,
  getTrackById,
  getAlbumById,
  getAllAlbums,
  getAllTracks,
} from '../../database/inMemoryDB';
import { CreateFavoriteDto } from './dtos/createFavorite.dto';
import { FavoritesResponse } from './interfaces/favoritesResponse';

@Injectable()
export class FavoritesService {
  async getAllFavorites(): Promise<FavoritesResponse> {
    const favoritesArtists = await Promise.all(
      favorites.artists.map((artistId) => getArtistById(artistId)),
    );
    const favoritesTracks = await Promise.all(
      favorites.tracks.map((trackId) => getTrackById(trackId)),
    );
    const favoritesAlbums = await Promise.all(
      favorites.albums.map((albumId) => getAlbumById(albumId)),
    );
    return {
      artists: favoritesArtists,
      albums: favoritesAlbums,
      tracks: favoritesTracks,
    };
  }

  async addFavorite({ id, type }: CreateFavoriteDto) {
    const entityExists = this.validateEntityExists(type, id);
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
    switch (type) {
      case 'artist':
        // return artists.some((artist) => artist.id === id);
        return !!getArtistById(id);
      case 'album':
        // return albums.some((album) => album.id === id);
        return !!getAlbumById(id);
      case 'track':
        // return tracks.some((track) => track.id === id);
        return !!getTrackById(id);
      default:
        return false;
    }
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
