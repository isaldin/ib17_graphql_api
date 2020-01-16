import DBHelper from '@app/tests/__helpers/db';
import { RatedArtistModel } from '@app/models/ratedArtist.model';
import { TrackModel } from '@app/models/track.model';
import addTracksToArtist from '@app/tests/__helpers/addTracksToArtist';
import { map } from 'ramda';
import { initRatedArtistsView } from '@app/db/initRatedArtistsView';
import { ArtistModel } from '@app/models/artist.model';

describe('RatedArtistModel', () => {
  let dbHelper: DBHelper;

  beforeAll(async () => {
    dbHelper = new DBHelper();
    await dbHelper.init();

    await ArtistModel.deleteMany({});
    await TrackModel.deleteMany({});

    await ArtistModel.create({
      artistId: 1,
      username: 'stim',
      name: 'stim',
      location: null,
    });
    await addTracksToArtist(
      [
        {
          round: 1,
          judgesRating: 12,
          popularRating: 10,
          status: 1,
        },
        {
          round: 2,
          judgesRating: 22,
          popularRating: 20,
          status: 1,
        },
      ],
      'stim',
    );
    await initRatedArtistsView(dbHelper.connection);
  });

  afterAll(async () => {
    await dbHelper.stop();
  });

  it('should have tracks property', async () => {
    const artist = await RatedArtistModel.findOne({ name: 'stim' });

    expect(artist!.tracks).toHaveLength(2);

    // Jest can not compare CoreMongooseArray with Array :-/
    // and can not ignore order, fuck
    const tracksModels = await TrackModel.find({ artist: artist!._id });
    const artistTracks = map(item => item.toJSON(), artist!.tracks);
    const tracks = map(item => item.toJSON(), tracksModels);
    expect(artistTracks.sort((a, b) => a.round - b.round)).toStrictEqual(
      tracks.sort((a, b) => a.round - b.round),
    );
  });

  it('should have `overallJudgesRating` property', async () => {
    const artist = await RatedArtistModel.findOne({ name: 'stim' });
    expect(artist!.overallJudgesRating).toEqual(34);
  });

  it('should have `overallPopularRating` property', async () => {
    const artist = await RatedArtistModel.findOne({ name: 'stim' });
    expect(artist!.overallPopularRating).toEqual(30);
  });
});
