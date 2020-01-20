// tslint:disable-next-line: no-implicit-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';
import { ArtistModel } from '@app/models/artist.model';
import { TrackModel } from '@app/models/track.model';
import { initRatedArtistsView } from '@app/db/initRatedArtistsView';

export default class DBHelper {
  private mongoServer: MongoMemoryServer;
  private mongooseConnection: Connection;

  constructor() {
    this.mongoServer = new MongoMemoryServer();
  }

  public async init() {
    const mongoUri = await this.mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    });
    await ArtistModel.createIndexes();
    await TrackModel.createIndexes();
    await initRatedArtistsView(mongoose.connection);

    this.mongooseConnection = mongoose.connection;
  }

  public get connection(): Connection {
    return this.mongooseConnection;
  }

  public async stop() {
    await mongoose.disconnect();
    await this.mongoServer.stop();
  }
}
