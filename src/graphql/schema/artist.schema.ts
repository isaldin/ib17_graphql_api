import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import { map, prop } from "ramda";

import artistController from "../../controllers/artist.controller";

const artistType = new GraphQLObjectType({
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
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
      name: { type: GraphQLString },
      offset: { type: GraphQLInt }
    },
    resolve: async (root, { limit = 10, name, offset = 0, id }) => {
      const artists = await artistController.allArtists({
        limit,
        offset,
        search: name
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
