import { GraphQLObjectType, GraphQLSchema } from "graphql";

import { ArtistSchema } from "./artist.schema";

export const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    fields: () => ({
      ...ArtistSchema.query
    }),
    name: "Query"
  }),
  types: [...ArtistSchema.types]
});
