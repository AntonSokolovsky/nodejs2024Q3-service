import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Album } from '../../entities/album.entity';
import { validate as isUuid } from 'uuid';
import { CreateAlbumDto } from './dtos/createAlbum.dto';
import { UpdateAlbumDto } from './dtos/updateAlbum.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}
  async getAllAlbums(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async getAlbumById(id: string): Promise<Album | null> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid album ID format. Expected a UUID.',
      );
    }

    const album = await this.prisma.album.findUnique({ where: { id } });
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
    const newAlbum = await this.prisma.album.create({ data: createAlbumDto });
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
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found.`);
    }

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: updateAlbumDto,
    });
    return updatedAlbum;
  }

  async deleteAlbum(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid album ID format. Expected a UUID.',
      );
    }
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found.`);
    } else {
      await this.prisma.album.delete({ where: { id } });
    }
  }
}
