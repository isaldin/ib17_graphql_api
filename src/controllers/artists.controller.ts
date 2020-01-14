import { IArtistModel, ArtistModel } from "@app/models/artist.model";

type SortTypes = "sort";

// default sort by rating (see tests)
// sorting priority:
//  rounds
//  wins/rounds
//  overall_judges
//  overall_popular
const getAllArtists = async (
  sort: SortTypes = "sort"
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
      $sort: {
        rounds: -1,
        wins_of_rounds: -1,
        overall_judges_rating: -1,
        overall_popular_rating: -1
      }
    }
  ]);
  return artists;
};

export default {
  getAllArtists
};
