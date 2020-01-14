import { map } from "ramda";
import { ArtistModel } from "@app/models/artist.model";
import { TrackModel } from "@app/models/track.model";

const addTracksToArtist = async (
  tracks: {
    round: number;
    judgesRating: number;
    popularRating: number;
    status: number;
  }[],
  artistName: string
) => {
  const createTracksPromises = map(async trackObj => {
    const artist = await ArtistModel.findOne({ name: artistName });
    const track = await new TrackModel({
      artist,
      trackId: Math.floor(Math.random() * 100000),
      path: "",
      round: trackObj.round,
      table: "yin",
      popular_rating: trackObj.popularRating,
      judges_rating: trackObj.judgesRating,
      judges_ratings: [],
      status: trackObj.status
    }).save();
    artist!.tracks.push(track);
    await artist!.save();
  }, tracks);
  await Promise.all(createTracksPromises);
};

export default addTracksToArtist;
