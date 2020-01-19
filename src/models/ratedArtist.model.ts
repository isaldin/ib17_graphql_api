import { Document, model, Model, Schema, Types } from 'mongoose';

import { ITrackModel, TrackSchema } from '@app/models/track.model';

interface IRatedArtistModel extends Document {
  _id: Types.ObjectId;
  artistId: number;
  username: string;
  name: string | null;
  location: string | null;
  tracks: Array<ITrackModel>;
  overallJudgesRating: number;
  overallPopularRating: number;
}

const RatedArtistSchema: Schema = new Schema(
  {
    artistId: Number,
    username: String,
    name: String,
    location: String,
    tracks: [TrackSchema],
    overallJudgesRating: { type: Number, index: true },
    overallPopularRating: { type: Number, index: true },
  },
  { collection: 'rated_artists' },
);

const RatedArtistModel: Model<IRatedArtistModel> = model<IRatedArtistModel>(
  'RatedArtist',
  RatedArtistSchema,
);

export { RatedArtistModel, IRatedArtistModel };
