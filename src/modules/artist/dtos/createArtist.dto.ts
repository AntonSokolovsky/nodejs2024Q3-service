import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

interface ICreateArtistDto {
  name: string;
  grammy: boolean;
}

export class CreateArtistDto implements ICreateArtistDto {
  @ApiProperty({
    example: 'Deacon',
    description: 'Artist name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: false,
    description: 'Has a grammy',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
