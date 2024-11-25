import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dtos/createAlbum.dto';
import { UpdateAlbumDto } from './dtos/updateAlbum.dto';
import { Album } from '../../entities/album.entity';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Albums')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
  @ApiOperation({
    summary: 'Get albums list',
    description: 'Gets all library albums list',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  @Get()
  async getAllAlbums(): Promise<Album[]> {
    return await this.albumService.getAllAlbums();
  }

  @ApiOperation({
    summary: 'Get single album by id',
    description: 'Get single album by id',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Album was not found',
  })
  @Get(':id')
  async getAlbumById(@Param('id') id: string): Promise<Album> {
    return await this.albumService.getAlbumById(id);
  }

  @ApiOperation({ summary: 'Create new album' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Album is created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. body does not contain required fields',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.albumService.createAlbum(createAlbumDto);
  }

  @ApiOperation({
    summary: 'Update album information',
    description: 'Update library album information by UUID',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The album has been updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Album was not found',
  })
  @Put(':id')
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    return await this.albumService.updateAlbum(id, updateAlbumDto);
  }

  @ApiOperation({
    summary: 'Delete album',
    description: 'Delete album from library',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Album was not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string): Promise<void> {
    await this.albumService.deleteAlbum(id);
  }
}
