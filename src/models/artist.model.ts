import { Document, model, Model, Schema, Types } from "mongoose";

import { ITrack } from "./track.model";

export interface IArtist extends Document {
  artistId: number;
  location?: string;
  name?: string;
  tracks: Types.DocumentArray<ITrack>;
  username: string;
}

const ArtistSchema: Schema = new Schema({
  artistId: {
    required: true,
    type: Number,
    unique: true
  },
  location: String,
  name: { type: String, index: true },
  tracks: [{ type: Schema.Types.ObjectId, ref: "Track" }],
  username: { type: String, index: true, required: true }
});

export const Artist: Model<IArtist> = model<IArtist>("Artist", ArtistSchema);
