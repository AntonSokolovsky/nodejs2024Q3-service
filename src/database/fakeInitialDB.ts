export const initialUsers = [
  {
    id: 'e2c60508-6746-4ca5-9008-934198d2261d',
    login: 'Peter',
    password: 'passw',
    version: 1,
    createdAt: 1731352275609,
    updatedAt: 1731352275609,
  },
  {
    id: '0df8c8ba-77b3-4db6-880c-2e6399d1b834',
    login: 'Mick',
    password: 'passw',
    version: 1,
    createdAt: 1731352290606,
    updatedAt: 1731352290606,
  },
  {
    id: '7c9c95ce-bc8e-4d8c-97e2-ce32dd96fbad',
    login: 'Nate',
    password: 'passw',
    version: 1,
    createdAt: 1731352299234,
    updatedAt: 1731352299234,
  },
];

export const initialArtists = [
  {
    id: '18b63d7e-7b24-4b2f-8b9c-d2a8a3a8bcb1',
    name: 'The Rolling Stones',
    grammy: true,
  },
  {
    id: 'ae7f3b6f-9d56-4c4f-b4e8-7b6c8f4a8e2b',
    name: 'Led Zeppelin',
    grammy: true,
  },
  {
    id: 'c1b75b56-e8a3-4a69-993f-9b11f2c60f4d',
    name: 'Pink Floyd',
    grammy: false,
  },
];

export const initialAlbums = [
  {
    id: 'b03fa9db-4f94-4e92-96d4-bb6bc86b9057',
    name: 'Let It Bleed',
    year: 2024,
    artistId: '18b63d7e-7b24-4b2f-8b9c-d2a8a3a8bcb1',
  },
  {
    id: 'd4fb5bb2-0d68-4b72-8af2-29ab8ef0e35d',
    name: 'Led Zeppelin IV',
    year: 2024,
    artistId: 'ae7f3b6f-9d56-4c4f-b4e8-7b6c8f4a8e2b',
  },
  {
    id: 'e6e9e7f9-6e4b-4929-853f-d1a2f94b2765',
    name: 'The Wall',
    year: 2024,
    artistId: 'c1b75b56-e8a3-4a69-993f-9b11f2c60f4d',
  },
];

export const initialTracks = [
  {
    id: 'ffb620ba-8b72-46f8-b5e7-f9c0b3b1c867',
    name: 'Gimme Shelter',
    artistId: '18b63d7e-7b24-4b2f-8b9c-d2a8a3a8bcb1',
    albumId: 'b03fa9db-4f94-4e92-96d4-bb6bc86b9057',
    duration: 270,
  },
  {
    id: 'c2cdb9a4-8f7b-4669-9e2c-01c3b3b6c19d',
    name: 'Stairway to Heaven',
    artistId: 'ae7f3b6f-9d56-4c4f-b4e8-7b6c8f4a8e2b',
    albumId: 'd4fb5bb2-0d68-4b72-8af2-29ab8ef0e35d',
    duration: 480,
  },
  {
    id: 'eacf03c8-6584-4c57-93e2-02739b15c6bf',
    name: 'Comfortably Numb',
    artistId: 'c1b75b56-e8a3-4a69-993f-9b11f2c60f4d',
    albumId: 'e6e9e7f9-6e4b-4929-853f-d1a2f94b2765',
    duration: 384,
  },
];

export const initialFavorites = {
  artists: ['18b63d7e-7b24-4b2f-8b9c-d2a8a3a8bcb1'],
  albums: ['d4fb5bb2-0d68-4b72-8af2-29ab8ef0e35d'],
  tracks: ['eacf03c8-6584-4c57-93e2-02739b15c6bf'],
};
