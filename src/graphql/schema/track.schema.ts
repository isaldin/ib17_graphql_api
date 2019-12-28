import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import artistController from "../../controllers/artist.controller";
import { artistType } from "./artist.schema";

export const trackType = new GraphQLObjectType({
  fields: () => ({
    artist: {
      resolve: parent => {
        return artistController.artistById(parent.artist);
      },
      type: artistType
    },
    id: { type: GraphQLString },
    pair: {
      resolve: parent => {
        return artistController.artistById(parent.pair);
      },
      type: artistType
    },
    path: { type: GraphQLString },
    round: { type: GraphQLInt }
  }),
  name: "Track"
});

export const TrackSchema = {
  types: [trackType]
};
