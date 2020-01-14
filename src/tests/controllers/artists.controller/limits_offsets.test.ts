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
    describe("limit", () => {
      it("should return 10 items if limit not passed", async () => {
        const artists = await artistsController.getAllArtists();
        expect(artists.length).toEqual(10);
      });
      it("should return setted count of items", async () => {
        const artists = await artistsController.getAllArtists({ limit: 20 });
        expect(artists.length).toEqual(20);
      });
    });

    describe("offset", () => {
      it("should return first 10 items if limit and offset not passed", async () => {
        const artists = await artistsController.getAllArtists();
        expect(artists.length).toEqual(10);
        expect(map(prop("artistId"), artists)).toStrictEqual([
          3011,
          6984,
          5629,
          4007,
          2556,
          2555,
          9372,
          3518,
          7631,
          6001
        ]);
      });
      it("should return setted count of items with setted offset", async () => {
        const artists = await artistsController.getAllArtists({
          limit: 5,
          offset: 5
        });
        expect(artists.length).toEqual(5);
        expect(map(prop("artistId"), artists)).toStrictEqual([
          2555,
          9372,
          3518,
          7631,
          6001
        ]);
      });
    });
  });
});
