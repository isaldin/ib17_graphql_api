import { ArgsType, Field, Int, registerEnumType } from 'type-graphql';

import { SortTypes } from '@app/controllers/ratedArtists.controller';

enum Sort {
  JUDGES_RATING = 'judges_rating_desc',
  POPULAR_RATING = 'popular_rating_desc',
}

registerEnumType(Sort, {
  name: 'TopRatedArtistsSort',
});

@ArgsType()
class TopRatedArtistsArgs {
  @Field(type => Int)
  limit: number;

  @Field(type => Sort)
  sort: SortTypes;
}

export default TopRatedArtistsArgs;
