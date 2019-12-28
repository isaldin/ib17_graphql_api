import { Artist, IArtist } from "../models/artist.model";
import { ITrack, Track } from "../models/track.model";

interface IGetTracksInput {
  authorId: string;
}
const getTracks = async (input: IGetTracksInput) =>
  await Track.find({
    artist: input.authorId
  }).sort("round");

interface IGetTrackInput {
  authorId: string;
  round: number;
}
const getTrack = async (input: IGetTrackInput) =>
  await Track.findOne({
    artist: input.authorId,
    round: input.round
  });

export default { getTracks, getTrack };
