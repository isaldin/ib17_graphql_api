import {
  Resolver,
  Query,
  Arg,
  InputType,
  Field,
  Root,
  FieldResolver
} from "type-graphql";
import { map } from "ramda";

import Artist from "@app/graphql/types/artist.type";
import Track from "@app/graphql/types/track.type";
import artistsController from "@app/controllers/.vaskir/artist.controller";
import { ITrackModel } from "@app/models/.vaskir/track.model";
import trackController from "@app/controllers/.vaskir/track.controller";

@InputType()
class ArtistsInputType {
  @Field({ defaultValue: 10 })
  limit: number;

  @Field({ defaultValue: 0 })
  offset: number;

  @Field(() => String, { nullable: true })
  searchCriteria: string | null;
}

@Resolver(of => Artist)
class ArtistResolver {
  @Query(returns => [Artist])
  async artists(@Arg("input") input: ArtistsInputType): Promise<Artist[]> {
    const items = await artistsController.allArtists(input);
    return map(
      item => ({
        id: `${item!._id}`,
        name: item!.name || item!.username,
        tracksIDs: [] /*map(
          (track: ITrackModel) => track._id.toString(),
          item!.tracks
        )*/
      }),
      items
    );
  }

  @Query(returns => Artist, { nullable: true })
  async artist(@Arg("id") id: string): Promise<Artist | null> {
    const result = await artistsController.artistById(id);
    if (!result) {
      return null;
    }

    return null; /*{
      id: result._id.toString(),
      name: result.name || result.username,
      tracksIDs: map(
        (track: ITrackModel) => track._id.toString(),
        result.tracks
      )
    };*/
  }

  @FieldResolver(type => [Track])
  async tracks(@Root() artist: Artist): Promise<Track[]> {
    const items = await trackController.getTracks(artist.tracksIDs);
    return map(
      (item: ITrackModel) => ({
        id: item._id.toString(),
        path: item.path,
        round: item.round,
        artistID: item.artist.toString()
      }),
      items
    );
  }
}

export default ArtistResolver;
