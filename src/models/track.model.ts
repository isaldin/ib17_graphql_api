import { Document, model, Model, Schema } from "mongoose";

import { IArtist } from "./artist.model";

export interface ITrack extends Document {
  artist: IArtist | string;
  pair?: IArtist | string;
  path: string;
  rating?: number;
}

const TrackSchema = new Schema({
  artist: {
    ref: "Artist",
    required: true,
    type: Schema.Types.ObjectId
  },
  pair: { type: Schema.Types.ObjectId, ref: "Artist" },
  path: { type: String, required: true },
  rating: Number,
  round: { type: Number, required: true },
  table: { type: String, enum: ["in", "yan"] },
  won: Boolean
});

export const Track: Model<ITrack> = model<ITrack>("Track", TrackSchema);
