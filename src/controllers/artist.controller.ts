import Artist, { IArtist } from "../models/artist.model";

interface IAllArtistsInput {
  offset: number;
  limit: number;
  search: string | null;
}
const AllArtists = async (input: IAllArtistsInput): Promise<IArtist[]> => {
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

export default { AllArtists };
