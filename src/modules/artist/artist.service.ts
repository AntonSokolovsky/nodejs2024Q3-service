import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from '../../entities/artist.entity';
import { validate as isUuid } from 'uuid';
import { CreateArtistDto } from './dtos/createArtist.dto';
import { UpdateArtistDto } from './dtos/updateArtist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}
  async getAllArtists(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async getArtistById(id: string): Promise<Artist | null> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid artist ID format. Expected a UUID.',
      );
    }

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found.`);
    }

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const { name, grammy } = createArtistDto;
    if (!name || !grammy) {
      throw new BadRequestException('Name and grammy are required fields.');
    }
    const newArtist = await this.prisma.artist.create({
      data: createArtistDto,
    });
    return newArtist;
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | undefined> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid artist ID format. Expected a UUID.',
      );
    }
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found.`);
    }

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
    return updatedArtist;
  }

  async deleteArtist(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid artist ID format. Expected a UUID.',
      );
    }
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found.`);
    } else {
      await this.prisma.artist.delete({ where: { id } });
    }
  }
}
