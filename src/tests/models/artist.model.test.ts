import DBHelper from '@app/tests/__helpers/db';
import { ArtistModel } from '@app/models/artist.model';

describe('ArtistModel', () => {
  let dbHelper: DBHelper;

  beforeAll(async () => {
    dbHelper = new DBHelper();
    await dbHelper.init();

    await ArtistModel.deleteMany({});
  });

  afterAll(async () => {
    await dbHelper.stop();
  });

  it('should set username as name if name is null on save', async () => {
    await ArtistModel.create({
      artistId: 1,
      username: 'stim',
      location: null,
    });
    const stim = await ArtistModel.findOne({ artistId: 1 });
    expect(stim?.name).toEqual('stim');
  });
});
