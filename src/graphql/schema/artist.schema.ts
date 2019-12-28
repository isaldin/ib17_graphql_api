import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import { map, prop } from "ramda";

import artistController from "../../controllers/artist.controller";
import trackController from "../../controllers/track.controller";
import { trackType } from "./track.schema";

export const artistType = new GraphQLObjectType({
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    track: {
      args: { round: { type: GraphQLInt } },
      resolve: (parent, args) =>
        trackController.getTrack({
          authorId: parent.id,
          round: args.round
        }),
      type: trackType
    },
    tracks: {
      resolve: parent => trackController.getTracks({ authorId: parent.id }),
      type: new GraphQLList(trackType)
    },
    username: { type: GraphQLString }
  }),
  name: "Artist"
});

const query = {
  artist: {
    args: { id: { type: GraphQLString } },
    resolve: (root, { id }) => artistController.artistById(id),
    type: artistType
  },
  artists: {
    args: {
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      searchCriteria: { type: GraphQLString }
    },
    resolve: async (root, { limit = 10, searchCriteria, offset = 0, id }) => {
      const artists = await artistController.allArtists({
        limit,
        offset,
        search: searchCriteria
      });
      return map(
        artist => ({
          id: prop("_id", artist),
          name: prop("name", artist),
          username: prop("username", artist)
        }),
        artists
      );
    },
    type: new GraphQLList(artistType)
  }
};

export const ArtistSchema = {
  query,
  types: [artistType]
};
