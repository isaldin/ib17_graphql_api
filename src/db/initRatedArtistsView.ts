import { Connection, Aggregate } from 'mongoose';

import { IRatedArtistModel } from '@app/models/ratedArtist.model';

const initRatedArtistsView = async (connection: Connection): Promise<void> => {
  try {
    const dropResult = await connection.db.dropCollection('rated_artists');
    console.log('rated_artists dropped: ', dropResult);
  } catch (error) {
    console.error(error);
    if (error.codeName !== 'NamespaceNotFound') {
      throw error;
    }
  }

  await connection.db.createCollection<IRatedArtistModel>('rated_artists', {
    viewOn: 'artists',
    pipeline: new Aggregate([
      {
        $addFields: {
          rounds: {
            $size: '$tracks',
          },
        },
      },
      {
        $match: {
          rounds: { $gt: 2 },
        },
      },
      {
        $lookup: {
          from: 'tracks',
          localField: 'tracks',
          foreignField: '_id',
          as: 'tracks',
        },
      },
      {
        $addFields: {
          wins: {
            $size: {
              $filter: {
                input: '$tracks',
                as: 'track',
                cond: {
                  $or: [{ $eq: ['$$track.status', 1] }, { $eq: ['$$track.status', 3] }],
                },
              },
            },
          },
          overall_judges_rating: {
            $sum: '$tracks.judges_rating',
          },
          overall_popular_rating: {
            $sum: '$tracks.popular_rating',
          },
        },
      },
      {
        $addFields: {
          wins_of_rounds: {
            $divide: ['$wins', '$rounds'],
          },
        },
      },
      {
        $sort: {
          rounds: -1,
          wins_of_rounds: -1,
          overall_judges_rating: -1,
          overall_popular_rating: -1,
          name: 1,
          username: 1,
        },
      },
      {
        $project: {
          _id: 1,
          artistId: 1,
          username: 1,
          name: 1,
          location: 1,
          tracks: 1,
          overallJudgesRating: '$overall_judges_rating',
          overallPopularRating: '$overall_popular_rating',
        },
      },
    ]).pipeline(),
  });
};

export { initRatedArtistsView };
