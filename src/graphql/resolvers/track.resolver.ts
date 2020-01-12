import { Resolver, Root, FieldResolver } from "type-graphql";
import { map } from "ramda";

import Track from "@app/graphql/types/track.type";
import Artist from "@app/graphql/types/artist.type";
import artistController from "@app/controllers/artist.controller";
import { ITrack } from "@app/models/track.model";

@Resolver(of => Track)
class TrackResolver {
  @FieldResolver(of => Artist)
  async artist(@Root() track: Track): Promise<Artist> {
    const result = await artistController.artistById(track.artistID);
    return {
      id: result!._id.toString(),
      name: result!.name || result!.username,
      tracksIDs: map((track: ITrack) => track._id.toString(), result!.tracks)
    };
  }
}

export default TrackResolver;
