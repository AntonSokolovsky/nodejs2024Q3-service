import { Module } from '@nestjs/common';
import { TrackModule } from 'src/modules/track/track.module';
import { FavoritesModule } from 'src/modules/favorites/favorites.module';
import { PrismaService } from './prisma.service';
import { AlbumModule } from 'src/modules/album/album.module';
import { UserModule } from 'src/modules/user/user.module';
import { ArtistModule } from 'src/modules/artist/artist.module';

@Module({
  imports: [
    UserModule,
    ArtistModule,
    TrackModule,
    FavoritesModule,
    AlbumModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
