import mongoose, { mongo } from "mongoose";
import DataLoader from "dataloader";
import { map, find, filter } from "ramda";

import { ArtistModel, IArtistModel } from "@app/models/.vaskir/artist.model";

const ArtistLoader = new DataLoader(
  async (ids: readonly string[]): Promise<(IArtistModel | null)[]> => {
    const artists = await ArtistModel.find({ _id: { $in: ids } });

    const result = map(
      id => find(artist => artist._id.equals(id), artists) || null,
      ids
    );

    return result;
  }
);

interface IAllArtistsInput {
  offset: number;
  limit: number;
  searchCriteria: string | null;
}
const allArtists = async (
  input: IAllArtistsInput
): Promise<(IArtistModel | null)[]> => {
  const artists: IArtistModel[] = await ArtistModel.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: new RegExp(input.searchCriteria || "", "ig") } },
          { username: { $regex: new RegExp(input.searchCriteria || "", "ig") } }
        ]
      }
    },
    {
      $lookup: {
        as: "tracks",
        foreignField: "_id",
        from: "tracks",
        localField: "tracks"
      }
    },
    {
      $addFields: {
        rating: {
          $sum: "$tracks.rating"
        }
      }
    },
    { $sort: { rating: -1, name: 1, username: 1 } },
    { $skip: input.offset },
    { $limit: input.limit }
  ]);

  const artistsIds = map(
    (artist: IArtistModel) => artist._id.toString(),
    artists
  );
  const rawData = await ArtistLoader.loadMany(artistsIds);

  return filter(
    // @ts-ignore // FIXME: to figure out
    item => item && item._id !== undefined,
    rawData
  );
};

const artistById = async (id: string): Promise<IArtistModel | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const artist = await ArtistLoader.load(id);

  return artist;
};

const countOfArtists = async (searchCriteria: string | null): Promise<number> =>
  await ArtistModel.countDocuments({
    $or: [
      { name: { $regex: new RegExp(searchCriteria || "", "ig") } },
      { username: { $regex: new RegExp(searchCriteria || "", "ig") } }
    ]
  });

export default { allArtists, artistById, countOfArtists };
