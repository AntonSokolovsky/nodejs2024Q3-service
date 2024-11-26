import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getFavoritesIds() {
    let favorites = await this.prisma.favorites.findUnique({
      where: { id: '1' },
    });
    if (!favorites)
      favorites = await this.prisma.favorites.create({
        data: { artists: [], albums: [], tracks: [] },
      });
    return favorites;
  }

  async getAllFavorites() {
    const favorites = await this.getFavoritesIds();
    const artists = await this.prisma.artist.findMany({
      where: {
        id: { in: favorites.artists },
      },
    });
    const albums = await this.prisma.album.findMany({
      where: {
        id: { in: favorites.albums },
      },
    });
    const tracks = await this.prisma.track.findMany({
      where: {
        id: { in: favorites.tracks },
      },
    });
    return { artists, albums, tracks };
  }

  async addEntityToFavorites(
    id: string,
    type: 'artist' | 'track' | 'album',
  ): Promise<void> {
    const entityExists = await this.validateEntityExists(type, id);
    if (!entityExists) {
      throw new UnprocessableEntityException(
        `${type} with id ${id} does not exist`,
      );
    }

    const favoriteField = `${type}s`;
    await this.prisma.favorites.update({
      where: { id: '1' },
      data: {
        [favoriteField]: {
          push: id,
        },
      },
    });
  }

  async removeFavorite(
    id: string,
    type: 'artist' | 'track' | 'album',
  ): Promise<void> {
    const favoriteField = `${type}s` as keyof typeof this.prisma.favorites;

    const favorite = await this.prisma.favorites.findUnique({
      where: { id: '1' },
    });

    if (!favorite || !favorite[favoriteField]?.includes(id)) {
      throw new NotFoundException(`${type} with ID ${id} is not in favorites.`);
    }

    await this.prisma.favorites.update({
      where: { id: '1' },
      data: {
        [favoriteField]: {
          set: favorite[favoriteField].filter(
            (favoriteId: string) => favoriteId !== id,
          ),
        },
      },
    });
  }
  async validateEntityExists(
    type: 'artist' | 'album' | 'track',
    id: string,
  ): Promise<boolean> {
    let result;
    switch (type) {
      case 'artist':
        result = await this.prisma.artist.findUnique({ where: { id } });
        break;
      case 'album':
        result = await this.prisma.album.findUnique({ where: { id } });
        break;
      case 'track':
        result = await this.prisma.track.findUnique({ where: { id } });
        break;
      default:
        return false;
    }
    return !!result;
  }
  async handleEntityDeletion(id: string, type: 'artist' | 'album' | 'track') {
    await this.removeFavorite(id, type);

    if (type === 'artist') {
      await this.prisma.album.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      });

      await this.prisma.track.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      });
    } else if (type === 'album') {
      await this.prisma.track.updateMany({
        where: { albumId: id },
        data: { albumId: null },
      });
    }
  }
}
