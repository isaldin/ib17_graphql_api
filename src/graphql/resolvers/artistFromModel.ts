import ArtistGQLType from '@app/graphql/types/artist.type';
import { IRatedArtistModel } from '@app/models/ratedArtist.model';
import { map, prop } from 'ramda';

const transform = (artistModel: IRatedArtistModel): ArtistGQLType => ({
  id: Base64.encode(`RatedArtist:${artistModel.artistId}`),
  name: artistModel.name,
  location: artistModel.location,
  overallJudgesRating: artistModel.overallJudgesRating,
  overallPopularRating: artistModel.overallPopularRating,
  trackIDs: map(prop('_id'), artistModel.tracks),
});

export default transform;
