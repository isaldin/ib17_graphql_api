import * as mongoose from "mongoose";

import Artist, { IArtist } from "../models/artist.model";
import "../models/track.model";

interface IAllArtistsInput {
  offset: number;
  limit: number;
  search: string | null;
}
const allArtists = async (input: IAllArtistsInput): Promise<IArtist[]> => {
  let result: IArtist[] = [];
  result = await Artist.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: new RegExp(input.search, "ig") } },
          { username: { $regex: new RegExp(input.search, "ig") } }
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

  return result;
};

const artistById = async (id: string | null): Promise<IArtist | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const artist = await Artist.findOne({ _id: id }).populate("tracks");

  return artist;
};

export default { allArtists, artistById };
