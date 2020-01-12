import { Document, model, Model, Schema, Types } from "mongoose";

export interface ITrack extends Document {
  _id: Types.ObjectId;
  artist: Types.ObjectId;
  pair?: Types.ObjectId;
  path: string;
  rating?: number;
  round: number;
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
