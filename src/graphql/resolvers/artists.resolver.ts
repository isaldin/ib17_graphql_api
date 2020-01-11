import { Resolver, Query, Arg, InputType, Field } from "type-graphql";
import { map } from "ramda";

import Artist from "../types/artist.type";
import artistsController from "../../controllers/artist.controller";

@InputType()
class ArtistsInputType {
  @Field({ defaultValue: 10 })
  limit: number;

  @Field({ defaultValue: 0 })
  offset: number;

  @Field(() => String, { nullable: true })
  searchCriteria: string | null;
}

@Resolver(Artist)
class ArtistsResolver {
  @Query(() => [Artist])
  async artists(
    @Arg("input")
    input: ArtistsInputType
  ): Promise<Artist[]> {
    const items = await artistsController.allArtists(input);
    return map(
      item => ({
        id: `${item.artistId}`,
        name: item.name || item.username
      }),
      items
    );
  }
}

export default ArtistsResolver;
