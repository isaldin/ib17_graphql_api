import { Document, model, Model, Schema, Types } from 'mongoose';

import { ITrackModel, TrackModel } from '@app/models/track.model';
import { reduce } from 'ramda';

interface IArtistModel extends Document {
  _id: Types.ObjectId;
  artistId: number;
  username: string;
  name: string | null;
  location: string | null;
  tracks: Array<ITrackModel | Types.ObjectId>;
  overall_rating: number;
}

const ArtistSchema: Schema = new Schema({
  artistId: {
    required: true,
    type: Number,
    unique: true,
  },
  username: { type: String, index: true, required: true },
  name: { type: String, index: true },
  location: String,
  tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
  overall_rating: Number,
});

const ArtistModel: Model<IArtistModel> = model<IArtistModel>('Artist', ArtistSchema);

export { ArtistModel, IArtistModel };
