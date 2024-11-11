import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from '../../entities/artist.entity';
import { validate as isUuid } from 'uuid';
import { CreateArtistDto } from './dtos/createArtist.dto';
import { UpdateArtistDto } from './dtos/updateArtist.dto';
import * as db from '../../database/inMemoryDB';

@Injectable()
export class ArtistService {
  async getAllArtists(): Promise<Artist[]> {
    return await db.getAllArtists();
  }

  async getArtistById(id: string): Promise<Artist | null> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid artist ID format. Expected a UUID.',
      );
    }

    const artist = await db.getArtistById(id);
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
    const newArtist = await db.createArtist(createArtistDto);
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
    const artist = await db.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found.`);
    }

    const updatedArtist = await db.updateArtist(id, {
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    });
    return updatedArtist;
  }

  async deleteArtist(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid artist ID format. Expected a UUID.',
      );
    }
    const deleted = await db.deleteArtist(id);
    if (!deleted) {
      throw new NotFoundException(`Artist with ID ${id} not found.`);
    }
  }
}
