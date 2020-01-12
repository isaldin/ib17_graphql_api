import DataLoader from "dataloader";
import { map, find, filter } from "ramda";

import { ITrack, Track } from "@app/models/track.model";

const TracksLoader = new DataLoader(
  async (ids: readonly string[]): Promise<(ITrack | null)[]> => {
    const tracks = await Track.find({ _id: { $in: ids } });

    const result = map(
      id => find(track => track._id.equals(id), tracks) || null,
      ids
    );

    return result;
  }
);

interface IGetTracksInput {
  authorId: string;
}
const getTracks = async (ids: string[]): Promise<ITrack[]> => {
  const rawResult = await TracksLoader.loadMany(ids);

  return filter(
    // @ts-ignore // FIXME: to figure out
    item => item && item._id !== undefined,
    rawResult
  );
};

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
