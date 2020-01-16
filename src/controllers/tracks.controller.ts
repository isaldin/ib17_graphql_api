import DataLoader from 'dataloader';
import { map, find, filter } from 'ramda';

import { ITrackModel, TrackModel } from '@app/models/track.model';

const TracksLoader = new DataLoader(
  async (ids: readonly string[]): Promise<(ITrackModel | null)[]> => {
    const tracks = await TrackModel.find({ _id: { $in: ids } });

    const result = map(id => find(track => track._id.equals(id), tracks) || null, ids);

    return result;
  },
);

const getTracks = async (ids: string[]): Promise<ITrackModel[]> => {
  const rawResult = await TracksLoader.loadMany(ids);

  return filter(
    // @ts-ignore // FIXME: to figure out
    item => item && item._id !== undefined,
    rawResult,
  );
};

interface IGetTrackInput {
  authorId: string;
  round: number;
}
const getTrack = async (input: IGetTrackInput) =>
  await TrackModel.findOne({
    artist: input.authorId,
    round: input.round,
  });

export default { getTracks, getTrack };
