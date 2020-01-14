import { map, prop } from "ramda";

import DBHelper from "@app/tests/__helpers/db";
import r1top100Seeder from "@app/tests/__seeders/round1_top100.seeder";
import { ArtistModel, IArtistModel } from "@app/models/artist.model";
import { TrackModel } from "@app/models/track.model";
import { artistsController } from "@app/controllers";

describe("artists.controller", () => {
  let dbHelper: DBHelper;

  beforeAll(async () => {
    dbHelper = new DBHelper();
    await dbHelper.init();

    await r1top100Seeder.seed();
  });

  afterAll(async () => {
    await dbHelper.stop();
  });

  describe("getAllArtists", () => {
    it("should fill virtuals in returned models", async () => {
      const artists = await artistsController.getAllArtists();
      const artist = artists[0];
      expect(artist.overallJudgesRating).toBeTruthy();
      expect(artist.overallPopularRating).toBeTruthy();
      expect(artist.tracks[0].path).toEqual(
        "/upload/music/ib17_r1_Oxxxymiron_6702900.mp3"
      );
    });
  });
});
