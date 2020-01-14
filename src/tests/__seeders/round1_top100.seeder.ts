/* eslint-disable @typescript-eslint/camelcase */
import path from "path";
import glob from "glob";
import util from "util";
import { reduce, concat, where, is, map, anyPass, allPass, isNil } from "ramda";
import fs from "fs";

import { ArtistModel, IArtistModel } from "@app/models/artist.model";
import { TrackModel, ITrackModel } from "@app/models/track.model";

const globPromise = util.promisify(glob);

const FIXTURE_PATH = path.join(__dirname, "../__fixtures/round1/top100.json");

const isValidArtistObject = where({
  user_id: is(Number),
  user: where({
    username: is(String),
    profile: where({
      location: anyPass([isNil, is(String)]),
      name: anyPass([isNil, is(String)])
    })
  })
});

const isValidTrackObject = where({
  judge_rating_sum: is(Number),
  rating_sum: is(Number),
  status: is(Number),
  id: is(Number),
  path: is(String)
});

const isValidObject = allPass([isValidArtistObject, isValidTrackObject]);

const seed = async (): Promise<void> => {
  const jsonContent = fs.readFileSync(FIXTURE_PATH);
  const parsedJson = JSON.parse(jsonContent.toString());

  await ArtistModel.deleteMany({});
  await TrackModel.deleteMany({});

  const modelsPromises = map(async (item): Promise<void> => {
    if (isValidObject(item)) {
      const artist = new ArtistModel({
        artistId: item.user_id,
        username: item.user.username,
        name: item.user.profile.name,
        location: item.user.profile.location,
        tracks: [],
        overall_rating: 0
      });

      const track = new TrackModel({
        trackId: item.id,
        artist,
        path: item.path,
        round: item.round_id,
        table: "qualifying",
        popular_rating: item.rating_sum,
        judges_rating: item.judge_rating_sum,
        judges_ratings: [],
        status: item.status
      });
      await track.save();

      artist.tracks.push(track);
      // artist.overall_rating = artist.overall_rating + track.judges_rating;
      await artist.save();
    }
  }, parsedJson);

  await Promise.all(modelsPromises);
};

export default { seed };

/*
{
  "id": 3139,
  "bit_author": null,
  "desc": null,
  "img": null,
  "meta1": {
      "duration": 49
  },
  "name": "ib17_r1_Oxxxymiron_6702900.mp3",
  "path": "/upload/music/ib17_r1_Oxxxymiron_6702900.mp3",
  "round_id": 1,
  "status": 1,
  "user_id": 3011,
  "rating_sum": 57,
  "userRating": null,
  "table_id": 1,
  "pair": null,
  "sort": 0,
  "user": {
      "username": "Oxxxymiron",
      "profile": {
          "location": " Санкт-Петербург",
          "name": "Oxxxymiron"
      }
  },
  "judge_rating_sum": 25
}
*/
