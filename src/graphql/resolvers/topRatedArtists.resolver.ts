import { Resolver, Query, Root, FieldResolver, Args } from 'type-graphql';
import { Base64 } from 'js-base64';

import ArtistGQLType from '@app/graphql/types/artist.type';
import TrackGQLType from '@app/graphql/types/track.type';
import { topRatedArtistsController, tracksController } from '@app/controllers';
import { map, prop } from 'ramda';

import TopRatedArtistsArgs from './topRatedArtists.args';

@Resolver(of => ArtistGQLType)
class TopRatedArtistsResolver {
  @Query(returns => [ArtistGQLType])
  async topRatedArtists(@Args() { limit, sort }: TopRatedArtistsArgs): Promise<ArtistGQLType[]> {
    const models = await topRatedArtistsController.getRatedArtists({ limit, sort });

    return map(
      item => ({
        id: Base64.encode(`RatedArtist:${item.artistId}`),
        name: item.name,
        location: item.location,
        overallJudgesRating: item.overallJudgesRating,
        overallPopularRating: item.overallPopularRating,
        trackIDs: map(prop('_id'), item.tracks),
      }),
      models,
    );
  }

  @FieldResolver(type => [TrackGQLType])
  async tracks(@Root() artist: ArtistGQLType): Promise<TrackGQLType[]> {
    const tracks = await tracksController.getTracks(
      map(trackId => trackId.toString(), artist.trackIDs),
    );

    return map(
      track => ({
        id: Base64.encode(`Track:${track.trackId}`),
        path: track.path || '',
        round: track.round,
        artistID: track.artist.toString(),
      }),
      tracks,
    );
  }
}

export default TopRatedArtistsResolver;
