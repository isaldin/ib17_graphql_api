import topRatedArtistsController from '@app/controllers/ratedArtists.controller';

import DBHelper from '@app/tests/__helpers/db';
import r1top100Seeder from '@app/tests/__seeders/round1_top100.seeder';
import rawR1Top100Json from '@app/tests/__fixtures/round1/top100.json';
import { initRatedArtistsView } from '@app/db/initRatedArtistsView';
import { map, prop, take, sortWith, descend, ascend, path } from 'ramda';

describe('ratedArtists.controller', () => {
  let dbHelper: DBHelper;

  beforeAll(async () => {
    dbHelper = new DBHelper();
    await dbHelper.init();

    await r1top100Seeder.seed();
    await initRatedArtistsView(dbHelper.connection);
  });

  afterAll(async () => {
    await dbHelper.stop();
  });

  describe('getRatedArtists function', () => {
    it('should exist', () => {
      expect(topRatedArtistsController.getRatedArtists).toBeDefined();
      expect(typeof topRatedArtistsController.getRatedArtists).toEqual('function');
    });

    it('should by default sort by overall judges rating by desc and return first 25 items )', async () => {
      const result = await topRatedArtistsController.getRatedArtists();

      const resultArtistIds = map(prop('artistId'), result);
      const top25Json = map(prop('user_id'), take(25, r1Top100SortedByOverallJudgesRatingDesc));

      expect(resultArtistIds).toStrictEqual(top25Json);
    });

    it('should sort by overall judges rating by asc', async () => {
      const result_asc = await topRatedArtistsController.getRatedArtists({
        limit: 12,
        sort: 'judges_rating_asc',
      });
      const resultArtistIds_asc = map(prop('artistId'), result_asc);
      const expectation_asc = map(
        prop('user_id'),
        take(12, r1Top100SortedByOverallJudgesRatingAsc),
      );
      expect(resultArtistIds_asc).toStrictEqual(expectation_asc);
    });

    it('should return by limit', async () => {
      const result = await topRatedArtistsController.getRatedArtists({ limit: 12 });
      const resultArtistIds = map(prop('artistId'), result);
      const top12Json = map(prop('user_id'), take(12, r1Top100SortedByOverallJudgesRatingDesc));

      expect(resultArtistIds).toStrictEqual(top12Json);
    });

    it('should sort by popular_rating', async () => {
      const result_desc = await topRatedArtistsController.getRatedArtists({
        limit: 12,
        sort: 'popular_rating_desc',
      });
      const resultArtistIds_desc = map(prop('artistId'), result_desc);
      const expectation_desc = map(
        prop('user_id'),
        take(12, r1Top100SortedByOverallPopularRatingDesc),
      );
      expect(resultArtistIds_desc).toStrictEqual(expectation_desc);

      const result_asc = await topRatedArtistsController.getRatedArtists({
        limit: 12,
        sort: 'popular_rating_asc',
      });
      const resultArtistIds_asc = map(prop('artistId'), result_asc);
      const expectation_asc = map(
        prop('user_id'),
        take(12, r1Top100SortedByOverallPopularRatingAsc),
      );
      expect(resultArtistIds_asc).toStrictEqual(expectation_asc);
    });
  });
});

// helpers

const r1Top100SortedByOverallJudgesRatingDesc = sortWith(
  [
    descend(prop('judge_rating_sum')),
    descend(prop('rating_sum')),
    ascend(path(['user', 'profile', 'name'])),
    ascend(path(['user', 'username'])),
  ],
  rawR1Top100Json,
);
const r1Top100SortedByOverallJudgesRatingAsc = sortWith(
  [
    ascend(prop('judge_rating_sum')),
    descend(prop('rating_sum')),
    ascend(path(['user', 'profile', 'name'])),
    ascend(path(['user', 'username'])),
  ],
  rawR1Top100Json,
);

const r1Top100SortedByOverallPopularRatingDesc = sortWith(
  [
    descend(prop('rating_sum')),
    descend(prop('judge_rating_sum')),
    ascend(path(['user', 'profile', 'name'])),
    ascend(path(['user', 'username'])),
  ],
  rawR1Top100Json,
);

const r1Top100SortedByOverallPopularRatingAsc = sortWith(
  [
    ascend(prop('rating_sum')),
    descend(prop('judge_rating_sum')),
    ascend(path(['user', 'profile', 'name'])),
    ascend(path(['user', 'username'])),
  ],
  rawR1Top100Json,
);
