import * as mongoose from "mongoose";

import { Artist, IArtist } from "../models/artist.model";
import "../models/track.model";

interface IAllArtistsInput {
  offset: number;
  limit: number;
  searchCriteria: string | null;
}
const allArtists = async (input: IAllArtistsInput): Promise<IArtist[]> => {
  return await Artist.aggregate([
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
};

const artistById = async (id: string | null): Promise<IArtist | null> => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const artist = await Artist.findOne({ _id: id }).populate("tracks");

  return artist;
};

const countOfArtists = async (searchCriteria: string | null): Promise<number> =>
  await Artist.countDocuments({
    $or: [
      { name: { $regex: new RegExp(searchCriteria || "", "ig") } },
      { username: { $regex: new RegExp(searchCriteria || "", "ig") } }
    ]
  });

export default { allArtists, artistById, countOfArtists };
