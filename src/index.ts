import 'reflect-metadata';
import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyGQL from 'fastify-gql';
import fastifyCORS from 'fastify-cors';
import mongoose from 'mongoose';
import { buildSchema } from 'type-graphql';
import fastifyCompress from 'fastify-compress';

import { FastifyInstanceType } from '@app/types';
import { initRatedArtistsView } from '@app/db/initRatedArtistsView';
import { topRatedArtistsResolver } from '@app/graphql/resolvers';

dotenv.config();

const port = parseInt(process.env.PORT || '3000', 10);
const uri = process.env.MONGO_URI || '';

const buildServer = async (): Promise<FastifyInstanceType> => {
  const app: FastifyInstanceType = fastify();
  app.register(fastifyCompress);

  const schema = await buildSchema({
    resolvers: [topRatedArtistsResolver],
  });

  app.register(fastifyGQL, {
    schema,
    graphiql: !process.env.PRODUCTION,
  });

  app.register(fastifyCORS, {
    origin: true,
  });

  return app;
};

const start = async () => {
  try {
    await mongoose.connect(uri, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.set('debug', !process.env.PRODUCTION);
    await mongoose.connection.db.setProfilingLevel('all');

    // await initRatedArtistsView(mongoose.connection);

    const server = await buildServer();
    await server.listen(port, '0.0.0.0');
    // tslint:disable-next-line: no-console
    console.log('Server running on port %d', port);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (!module.parent) {
  start();
}

export default buildServer;
