import {
  Resolver,
  Query,
  Arg,
  InputType,
  Root,
  FieldResolver
} from "type-graphql";
import { Base64 } from "js-base64";

import { ArtistGQLType as Artist } from "@app/graphql/types";
import { artistsController } from "@app/controllers";
import { map } from "ramda";

@Resolver(of => Artist)
class ArtistResolver {
  @Query(returns => [Artist])
  async artists(): Promise<Artist[]> {
    const models = await artistsController.getAllArtists();
    return map(
      model => ({
        id: Base64.encode(`artist/${model.artistId}`),
        name: model.name,
        username: model.username,
        location: model.location,
        trackIDs: [],
        overallJudgesRating: model.overallJudgesRating,
        overallPopularRating: model.overallPopularRating
      }),
      models
    );
  }
}

export default ArtistResolver;
