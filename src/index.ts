import "reflect-metadata";
import dotenv from "dotenv";
import fastify from "fastify";
import fastifyGQL from "fastify-gql";
import mongoose from "mongoose";
import { buildSchema } from "type-graphql";
import fastifyCompress from "fastify-compress";

import { FastifyInstanceType } from "@app/types";
// import ArtistResolver from "@app/graphql/resolvers/artists.resolver";
// import TrackResolver from "@app/graphql/resolvers/track.resolver";

dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);
const uri = process.env.MONGO_URI || "";

const buildServer = async (): Promise<FastifyInstanceType> => {
  const app: FastifyInstanceType = fastify();
  // const schema = await buildSchema({});

  app.register(fastifyCompress);

  // app.register(fastifyGQL, {
  //   schema,
  //   graphiql: !process.env.PRODUCTION
  // });

  return app;
};

const start = async () => {
  try {
    await mongoose.connect(uri, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    mongoose.set("debug", !process.env.PRODUCTION);

    const server = await buildServer();
    await server.listen(port, "0.0.0.0");
    // tslint:disable-next-line: no-console
    console.log("Server running on port %d", port);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (!module.parent) {
  start();
}

export default buildServer;
