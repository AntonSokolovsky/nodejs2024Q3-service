import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { CreateFavoriteDto } from './dtos/createFavorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}
  async getAllFavorites() {
    const favorites = await this.getAllFavorites();
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

  async addEntityToFavorites({
    id,
    type,
  }: CreateFavoriteDto): Promise<{ message: string }> {
    const entityExists = await this.validateEntityExists(type, id);

    if (!entityExists) {
      throw new UnprocessableEntityException(
        `${type} with id ${id} does not exist`,
      );
    }

    const existingFavorite = await this.prisma.favorites.findFirst({
      where: {
        [`${type}Id`]: id,
      },
    });

    if (existingFavorite) {
      throw new ConflictException(
        `${type} with id ${id} is already in favorites`,
      );
    }

    await this.prisma.favorites.create({
      data: {
        [`${type}Id`]: id,
      },
    });

    return { message: `${type} with id ${id} added to favorites` };
  }

  async removeFavorite(id: string, type: 'artist' | 'album' | 'track') {
    const favorite = await this.prisma.favorites.findFirst({
      where: {
        [`${type}Id`]: id,
      },
    });

    if (!favorite) {
      throw new NotFoundException(`${type} with id ${id} is not in favorites`);
    }

    await this.prisma.favorites.delete({
      where: { id: favorite.id },
    });
  }

  async validateEntityExists(
    type: 'artist' | 'album' | 'track',
    id: string,
  ): Promise<boolean> {
    switch (type) {
      case 'artist':
        return !!(await this.prisma.artist.findUnique({ where: { id } }));
      case 'album':
        return !!(await this.prisma.album.findUnique({ where: { id } }));
      case 'track':
        return !!(await this.prisma.track.findUnique({ where: { id } }));
      default:
        return false;
    }
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
}
