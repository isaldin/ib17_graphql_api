import { IArtistModel, ArtistModel } from "@app/models/artist.model";

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;
const DEFAULT_SORTING = {
  rounds: -1,
  wins_of_rounds: -1,
  overall_judges_rating: -1,
  overall_popular_rating: -1
};

// default sort by rating (see tests)
// sorting priority:
//  rounds
//  wins/rounds
//  overall_judges
//  overall_popular
const getAllArtists = async (
  input: {
    limit?: number;
    offset?: number;
  } = { limit: 10, offset: 0 }
): Promise<IArtistModel[]> => {
  const artists = await ArtistModel.aggregate([
    {
      $lookup: {
        from: "tracks",
        localField: "tracks",
        foreignField: "_id",
        as: "tracks"
      }
    },
    {
      $addFields: {
        rounds: {
          $size: "$tracks"
        },
        wins: {
          $size: {
            $filter: {
              input: "$tracks",
              as: "track",
              cond: {
                $or: [
                  { $eq: ["$$track.status", 1] },
                  { $eq: ["$$track.status", 3] }
                ]
              }
            }
          }
        },
        overall_judges_rating: {
          $sum: "$tracks.judges_rating"
        },
        overall_popular_rating: {
          $sum: "$tracks.popular_rating"
        }
      }
    },
    {
      $addFields: {
        wins_of_rounds: {
          $divide: ["$wins", "$rounds"]
        }
      }
    },
    {
      $sort: DEFAULT_SORTING
    },
    {
      $project: {
        _id: 1,
        artistId: 1,
        username: 1,
        name: 1,
        location: 1,
        tracks: 1,
        overallJudgesRating: "$overall_judges_rating",
        overallPopularRating: "$overall_popular_rating"
      }
    },
    {
      $skip: input.offset || DEFAULT_OFFSET
    },
    {
      $limit: input.limit || DEFAULT_LIMIT
    }
  ]);
  return artists;
};

export default getAllArtists;
