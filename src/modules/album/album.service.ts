import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Album } from '../../entities/album.entity';
import { validate as isUuid } from 'uuid';
import { CreateAlbumDto } from './dtos/createAlbum.dto';
import { UpdateAlbumDto } from './dtos/updateAlbum.dto';
import * as db from '../../database/inMemoryDB';

@Injectable()
export class AlbumService {
  async getAllAlbums(): Promise<Album[]> {
    return await db.getAllAlbums();
  }

  async getAlbumById(id: string): Promise<Album | null> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid album ID format. Expected a UUID.',
      );
    }

    const album = await db.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found.`);
    }

    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const { name, year } = createAlbumDto;
    if (!name || !year) {
      throw new BadRequestException('Name and year are required fields.');
    }
    const newAlbum = await db.createAlbum(createAlbumDto);
    return newAlbum;
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | undefined> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid album ID format. Expected a UUID.',
      );
    }
    const album = await db.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found.`);
    }

    const updatedAlbum = await db.updateAlbum(id, {
      ...updateAlbumDto,
    });
    return updatedAlbum;
  }

  async deleteAlbum(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid album ID format. Expected a UUID.',
      );
    }
    const deleted = await db.deleteAlbum(id);
    if (!deleted) {
      throw new NotFoundException(`Album with ID ${id} not found.`);
    }
  }
}
