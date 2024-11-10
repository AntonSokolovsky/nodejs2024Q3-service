import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/modules/user/dtos/createUser.dto';
import { Artist } from 'src/entities/artist.entity';
import { CreateArtistDto } from 'src/modules/artist/dtos/createArtist.dto';
import { Track } from 'src/entities/track.entity';
import { CreateTrackDto } from 'src/modules/track/dtos/createTrack.dto';
import { Album } from 'src/entities/album.entity';
import { CreateAlbumDto } from 'src/modules/album/dtos/createAlbum.dto';

const users: User[] = [];
const artists: Artist[] = [];
const tracks: Track[] = [];
const albums: Album[] = [];

export async function getAllUsers() {
  return users;
}

export async function createUser(createUserDto: CreateUserDto): Promise<User> {
  const timestamp = Date.now();
  const newUser: User = {
    id: uuidv4(),
    login: createUserDto.login,
    password: createUserDto.password,
    version: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  users.push(newUser);
  return newUser;
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((user) => user.id === id) || null;
}

export async function updateUser(
  id: string,
  updatedData: Partial<User>,
): Promise<User | null> {
  const user = users.find((user) => user.id === id);
  if (user) {
    Object.assign(user, {
      password: updatedData.password,
      updatedAt: Date.now(),
      version: user.version + 1,
    });
    return user;
  }
  return null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const index = users.findIndex((user) => user.id === id);
  if (index >= 0) {
    users.splice(index, 1);
    return true;
  }
  return false;
}

export async function getAllArtists() {
  return artists;
}
export async function createArtist(
  createArtistDto: CreateArtistDto,
): Promise<Artist> {
  const newArtist: Artist = {
    id: uuidv4(),
    name: createArtistDto.name,
    grammy: createArtistDto.grammy,
  };
  artists.push(newArtist);
  return newArtist;
}

export async function getArtistById(id: string): Promise<Artist | null> {
  return artists.find((artist) => artist.id === id) || null;
}

export async function updateArtist(
  id: string,
  updatedData: Partial<Artist>,
): Promise<Artist | null> {
  const artist = artists.find((artist) => artist.id === id);
  if (artist) {
    Object.assign(artist, updatedData, {
      ...updatedData,
    });
    return artist;
  }
  return null;
}

export async function deleteArtist(id: string): Promise<boolean> {
  const index = artists.findIndex((artist) => artist.id === id);
  if (index >= 0) {
    artists.splice(index, 1);
    return true;
  }
  return false;
}

export async function getAllTracks() {
  return tracks;
}
export async function createTrack(
  createTrackDto: CreateTrackDto,
): Promise<Track> {
  const newTrack: Track = {
    id: uuidv4(),
    ...createTrackDto,
  };
  tracks.push(newTrack);
  return newTrack;
}

export async function getTrackById(id: string): Promise<Track | null> {
  return tracks.find((track) => track.id === id) || null;
}

export async function updateTrack(
  id: string,
  updatedData: Partial<Track>,
): Promise<Track | null> {
  const track = tracks.find((track) => track.id === id);
  if (track) {
    Object.assign(track, updatedData, {
      ...updatedData,
    });
    return track;
  }
  return null;
}

export async function deleteTrack(id: string): Promise<boolean> {
  const index = tracks.findIndex((track) => track.id === id);
  if (index >= 0) {
    tracks.splice(index, 1);
    return true;
  }
  return false;
}

export async function getAllAlbums() {
  return albums;
}
export async function createAlbum(
  createAlbumDto: CreateAlbumDto,
): Promise<Album> {
  const newAlbum: Album = {
    id: uuidv4(),
    ...createAlbumDto,
  };
  albums.push(newAlbum);
  return newAlbum;
}

export async function getAlbumById(id: string): Promise<Album | null> {
  return albums.find((album) => album.id === id) || null;
}

export async function updateAlbum(
  id: string,
  updatedData: Partial<Album>,
): Promise<Album | null> {
  const album = albums.find((album) => album.id === id);
  if (album) {
    Object.assign(album, updatedData, {
      ...updatedData,
    });
    return album;
  }
  return null;
}

export async function deleteAlbum(id: string): Promise<boolean> {
  const index = albums.findIndex((album) => album.id === id);
  if (index >= 0) {
    albums.splice(index, 1);
    return true;
  }
  return false;
}
