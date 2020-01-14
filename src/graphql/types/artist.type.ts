import { ObjectType, Field, ID } from "type-graphql";
import { Types } from "mongoose";

import { TrackGQLType } from "@app/graphql/types";

@ObjectType("Artist")
class ArtistGQLType {
  @Field(type => ID)
  id: string;

  @Field(type => String, { nullable: true })
  name: string | null;

  @Field(type => String)
  username: string;

  @Field(type => String, { nullable: true })
  location: string | null;

  @Field()
  overallJudgesRating: number;

  @Field()
  overallPopularRating: number;

  // @Field(type => [TrackGQLType])
  // tracks: TrackGQLType[];

  trackIDs: Types.ObjectId[];
}

export default ArtistGQLType;

// import {
//   GraphQLInt,
//   GraphQLList,
//   GraphQLNonNull,
//   GraphQLObjectType,
//   GraphQLString
// } from "graphql";
// import { map, prop } from "ramda";

// import artistController from "../../controllers/artist.controller";
// import trackController from "../../controllers/track.controller";
// import { trackType } from "./track.schema";

// export const artistType = new GraphQLObjectType({
//   fields: () => ({
//     id: { type: new GraphQLNonNull(GraphQLString) },
//     name: { type: GraphQLString },
//     track: {
//       args: { round: { type: GraphQLInt } },
//       resolve: (parent, args) =>
//         trackController.getTrack({
//           authorId: parent.id,
//           round: args.round
//         }),
//       type: trackType
//     },
//     tracks: {
//       resolve: parent => trackController.getTracks({ authorId: parent.id }),
//       type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(trackType)))
//     },
//     username: { type: GraphQLString }
//   }),
//   name: "Artist"
// });

// const query = {
//   artist: {
//     args: { id: { type: new GraphQLNonNull(GraphQLString) } },
//     resolve: (root, { id }) => artistController.artistById(id),
//     type: artistType
//   },
//   artists: {
//     args: {
//       limit: { type: GraphQLInt },
//       offset: { type: GraphQLInt },
//       searchCriteria: { type: GraphQLString }
//     },
//     resolve: async (root, { limit = 10, searchCriteria, offset = 0, id }) => {
//       const artists = await artistController.allArtists({
//         limit,
//         offset,
//         searchCriteria
//       });
//       const count = await artistController.countOfArtists(searchCriteria);
//       return {
//         count,
//         list: map(
//           artist => ({
//             id: prop("_id", artist),
//             name: prop("name", artist),
//             username: prop("username", artist)
//           }),
//           artists
//         )
//       };
//     },
//     type: new GraphQLNonNull(
//       new GraphQLObjectType({
//         fields: () => ({
//           count: { type: new GraphQLNonNull(GraphQLInt) },
//           list: {
//             type: new GraphQLNonNull(
//               new GraphQLList(new GraphQLNonNull(artistType))
//             )
//           }
//         }),
//         name: "Artists"
//       })
//     )
//   }
// };

// export const ArtistSchema = {
//   query,
//   types: [artistType]
// };
