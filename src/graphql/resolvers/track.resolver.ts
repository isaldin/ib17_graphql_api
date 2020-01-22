import { Resolver, Query, Root, FieldResolver, Args } from 'type-graphql';

import ArtistGQLType from '@app/graphql/types/artist.type';
import TrackGQLType from '@app/graphql/types/track.type';
import { RatedArtistModel } from '@app/models/ratedArtist.model';

import artistFromModel from './artistFromModel';

const roundNamesMap: { [key: number]: string } = {
  1: 'В долгий путь',
  2: 'Ветер перемен',
  3: 'Дело нескольких минут',
};

@Resolver(of => TrackGQLType)
class TrackResolver {
  @FieldResolver(type => String)
  trackName(@Root() track: TrackGQLType): string {
    return roundNamesMap[track.round];
  }

  @FieldResolver(type => ArtistGQLType)
  async artist(@Root() track: TrackGQLType): Promise<ArtistGQLType> {
    const artistModel = await RatedArtistModel.findById(track.artistID);
    return artistFromModel(artistModel!);
  }
}

export default TrackResolver;
