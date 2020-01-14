import { map, prop } from "ramda";

import { ArtistModel, IArtistModel } from "@app/models/artist.model";
import { artistsController } from "@app/controllers";

import DBHelper from "@app/tests/__helpers/db";
import artistsSeeder from "@app/tests/__seeders/artists.seeder";
import addTracksToArtist from "@app/tests/__helpers/addTracksToArtist";

describe("artists.controller", () => {
  let dbHelper: DBHelper;

  beforeAll(async () => {
    dbHelper = new DBHelper();
    await dbHelper.init();
  });

  afterAll(async () => {
    await dbHelper.stop();
  });

  const _seedTracksForTestSortingByRating = async () => {
    await artistsSeeder.seed();

    // statuses: 1 - pass, 2 - fall, 3 - pass
    // artist: [round: status/judges_rating/popular_rating]
    /*
      zagi: [
        1: 1/15/12
        2: 1/33/44
        3: 1/23/21
      ]
    */
    await addTracksToArtist(
      [
        {
          round: 1,
          judgesRating: 15,
          popularRating: 12,
          status: 1
        },
        {
          round: 2,
          judgesRating: 33,
          popularRating: 44,
          status: 1
        },
        {
          round: 3,
          judgesRating: 23,
          popularRating: 21,
          status: 1
        }
      ],
      "zagi"
    );
    /*
      oxxxy: [
        1: 1/11/9
        2: 3/2/8 // ha-ha, looser
        3: 1/22/23
      ]
    */
    await addTracksToArtist(
      [
        {
          round: 1,
          judgesRating: 11,
          popularRating: 9,
          status: 1
        },
        {
          round: 2,
          judgesRating: 2,
          popularRating: 8,
          status: 3
        },
        {
          round: 3,
          judgesRating: 22,
          popularRating: 23,
          status: 1
        }
      ],
      "oxxxy"
    );
    /*
      noize: [
        1: 1/200/200
        2: 1/200/200
      ]
    */
    await addTracksToArtist(
      [
        {
          round: 1,
          judgesRating: 200,
          popularRating: 200,
          status: 1
        },
        {
          round: 2,
          judgesRating: 200,
          popularRating: 200,
          status: 1
        }
      ],
      "noize"
    );
    /*
      lu4nik: [
        1: 1/10/4
        2: 1/21/14
        3: 1/20/22
      ]
    */
    await addTracksToArtist(
      [
        {
          round: 1,
          judgesRating: 10,
          popularRating: 4,
          status: 1
        },
        {
          round: 2,
          judgesRating: 21,
          popularRating: 14,
          status: 1
        },
        {
          round: 3,
          judgesRating: 20,
          popularRating: 22,
          status: 1
        }
      ],
      "lu4nik"
    );
    /*
      stim: [
        1: 1/100/100
        2: 1/100/100
        3: 2/100/100
      ]
    */
    await addTracksToArtist(
      [
        {
          round: 1,
          judgesRating: 100,
          popularRating: 100,
          status: 1
        },
        {
          round: 2,
          judgesRating: 100,
          popularRating: 100,
          status: 1
        },
        {
          round: 3,
          judgesRating: 100,
          popularRating: 100,
          status: 2
        }
      ],
      "stim"
    );
  };
  /*
    artist [overall_judges/overall_popular/wins/rounds]
    zagi    [70/77/3/3]
    oxxxy   [35/40/3/3]
    lu4nik  [51/40/3/3]
    stim    [300/300/2/3]
    noize   [400/400/2/2]

    sorting priority:
      // rounds
      // wins/rounds
      // overall_judges
      // overall_popular

  */

  describe("getAllArtists()", () => {
    beforeAll(async () => {
      await ArtistModel.deleteMany({});
      await _seedTracksForTestSortingByRating();
    });

    it("should sort by rating (default sorting type)", async () => {
      const artists = await artistsController.getAllArtists();
      const artistsNames = map(prop("name"), artists);
      expect(artistsNames).toStrictEqual([
        "zagi",
        "lu4nik",
        "oxxxy",
        "stim",
        "noize"
      ]);
    });
  });
});
