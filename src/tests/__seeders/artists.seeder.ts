import { ArtistModel } from '@app/models/artist.model';
import { map, toPairs } from 'ramda';

const seeder = {
  seed: async (): Promise<void> => {
    const artists: [number, string][] = [
      [5, 'noize'],
      [4, 'stim'],
      [2, 'oxxxy'],
      [3, 'lu4nik'],
      [1, 'zagi'],
      [6, '228'],
      // [6, "baban"],
      // [7, "dj"],
      // [8, "228"],
      // [9, "repac"],
      // [10, "tanir"]
    ];

    await ArtistModel.create(
      map(
        item => ({
          artistId: item[0],
          username: item[1],
          name: item[1],
          location: null,
        }),
        artists,
      ),
    );
  },
};

export default seeder;
