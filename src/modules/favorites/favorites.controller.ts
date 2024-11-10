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

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites() {
    return await this.favoritesService.getAllFavorites();
  }

  @Post(':type/:id')
  async addFavorite(
    @Param('type') type: 'artist' | 'album' | 'track',
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return await this.favoritesService.addFavorite({ id, type });
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @Param('type') type: 'artist' | 'album' | 'track',
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.favoritesService.removeFavorite(id, type);
  }
}
