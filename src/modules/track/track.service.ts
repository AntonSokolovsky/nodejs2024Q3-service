import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from '../../entities/track.entity';
import { validate as isUuid } from 'uuid';
import { CreateTrackDto } from './dtos/createTrack.dto';
import { UpdateTrackDto } from './dtos/updateTrack.dto';
import * as db from '../../database/inMemoryDB';

@Injectable()
export class TrackService {
  async getAllTracks(): Promise<Track[]> {
    return await db.getAllTracks();
  }

  async getTrackById(id: string): Promise<Track | null> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid track ID format. Expected a UUID.',
      );
    }

    const track = await db.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found.`);
    }

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    const { name, duration } = createTrackDto;
    if (!name || !duration) {
      throw new BadRequestException('Name and duration are required fields.');
    }
    const newTrack = await db.createTrack(createTrackDto);
    return newTrack;
  }

  async updateTrack(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track | undefined> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid track ID format. Expected a UUID.',
      );
    }
    const track = await db.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found.`);
    }

    const updatedTrack = await db.updateTrack(id, {
      //   name: updateTrackDto.name,
      //   grammy: updateTrackDto.grammy,
      ...updateTrackDto,
    });
    return updatedTrack;
  }

  async deleteTrack(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid track ID format. Expected a UUID.',
      );
    }
    const deleted = await db.deleteTrack(id);
    if (!deleted) {
      throw new NotFoundException(`Track with ID ${id} not found.`);
    }
  }
}
