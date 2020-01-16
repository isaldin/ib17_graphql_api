import { RatedArtistModel, IRatedArtistModel } from '@app/models/ratedArtist.model';

type SortTypes =
  | 'judges_rating_desc'
  | 'judges_rating_asc'
  | 'popular_rating_desc'
  | 'popular_rating_asc';

interface IGetRatedArtistsInput {
  sort?: SortTypes;
  limit?: number;
}

const defaultParams: { sort: SortTypes; limit: number } = {
  sort: 'judges_rating_desc',
  limit: 25,
};

const getRatedArtists = async (input?: IGetRatedArtistsInput): Promise<IRatedArtistModel[]> => {
  const params = {
    ...defaultParams,
    ...input,
  };
  return RatedArtistModel.find({})
    .sort(buildSortingParams(params.sort))
    .limit(params.limit);
};

export { getRatedArtists };

//

const buildSortingParams = (type: SortTypes): { [field: string]: number } => {
  switch (type) {
    case 'popular_rating_desc':
      return { overallPopularRating: -1 };
    case 'popular_rating_asc':
      return { overallPopularRating: 1, overallJudgesRating: -1, name: 1, username: 1 };
    case 'judges_rating_asc':
      return { overallJudgesRating: 1, overallPopularRating: -1, name: 1, username: 1 };
    default:
      return {};
  }
};
