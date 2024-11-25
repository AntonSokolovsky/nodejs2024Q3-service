import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from '../../entities/track.entity';
import { validate as isUuid } from 'uuid';
import { CreateTrackDto } from './dtos/createTrack.dto';
import { UpdateTrackDto } from './dtos/updateTrack.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}
  async getAllTracks(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async getTrackById(id: string): Promise<Track | null> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid track ID format. Expected a UUID.',
      );
    }

    const track = await this.prisma.track.findUnique({ where: { id } });
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
    const newTrack = await this.prisma.track.create({ data: createTrackDto });
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
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found.`);
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });
    return updatedTrack;
  }

  async deleteTrack(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        'Invalid track ID format. Expected a UUID.',
      );
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found.`);
    } else {
      await this.prisma.track.delete({ where: { id } });
    }
  }
}
