import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({
    summary: 'Gets all favorites',
    description: 'Gets all favorites album, tracks and artists',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @Get()
  async getAllFavorites() {
    return await this.favoritesService.getAllFavorites();
  }

  @ApiOperation({
    summary: 'Add item to the favorites',
    description: 'Add item to the favorites',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Added successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. itemId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Item with id doesn't exist",
  })
  @Post(':type/:id')
  async addFavorite(
    @Param('type') type: 'artist' | 'album' | 'track',
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return await this.favoritesService.addEntityToFavorites({ id, type });
  }

  @ApiOperation({
    summary: 'Delete track from favorites',
    description: 'Delete track from favorites',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. itemId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Track was not found',
  })
  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @Param('type') type: 'artist' | 'album' | 'track',
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.favoritesService.removeFavorite(id, type);
  }
}
