import "reflect-metadata";
import dotenv from "dotenv";
import fastify from "fastify";
import fastifyGQL from "fastify-gql";
import mongoose from "mongoose";
import { buildSchema } from "type-graphql";

import { FastifyInstanceType } from "@app/types";
import ArtistResolver from "@app/graphql/resolvers/artists.resolver";
import TrackResolver from "@app/graphql/resolvers/track.resolver";

dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);
const uri = process.env.MONGO_URI || "";

const app: FastifyInstanceType = fastify();

(async () => {
  await mongoose.connect(uri, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.set("debug", !process.env.PRODUCTION);

  const schema = await buildSchema({
    resolvers: [ArtistResolver, TrackResolver]
  });

  app.register(fastifyGQL, {
    schema,
    graphiql: !process.env.PRODUCTION
  });

  app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log("Server running on port %d", port);
  });
})();
