import { Document, model, Model, Schema, Types } from 'mongoose';

import { ITrackModel } from '@app/models/track.model';

interface IArtistModel extends Document {
  _id: Types.ObjectId;
  artistId: number;
  username: string;
  name: string | null;
  location: string | null;
  tracks: Array<ITrackModel['_id']>;
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
});

ArtistSchema.pre('save', function(this: IArtistModel) {
  if (this.name == null) {
    this.name = this.username;
  }
});

const ArtistModel: Model<IArtistModel> = model<IArtistModel>('Artist', ArtistSchema);

export { ArtistModel, IArtistModel };
