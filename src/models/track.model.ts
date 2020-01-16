import { Document, model, Model, Schema, Types } from "mongoose";

import { IArtistModel } from "@app/models/artist.model";

interface ITrackModel extends Document {
  _id: Types.ObjectId;
  trackId: { type: Number; unique: true; required: true };
  artist: Types.ObjectId | IArtistModel;
  pair: Types.ObjectId | IArtistModel | null;
  path: string | null;
  round: number;
  table: "qualifying" | "yin" | "yang";
  popular_rating: number;
  judges_rating: number;
  judges_ratings: object[];
  lifebuoy: boolean | null;
  status: number;
}

const TrackSchema = new Schema({
  trackId: { type: Number, unique: true, required: true },
  artist: {
    ref: "Artist",
    required: true,
    type: Schema.Types.ObjectId
  },
  pair: { type: Schema.Types.ObjectId, ref: "Artist" },
  path: String,
  popular_rating: Number,
  judges_rating: Number,
  judges_ratings: [],
  round: { type: Number, required: true },
  table: { type: String, enum: ["qualifying", "yin", "yang"], required: true },
  lifebuoy: Boolean,
  status: Number
});

const TrackModel: Model<ITrackModel> = model<ITrackModel>("Track", TrackSchema);

export { TrackModel, ITrackModel, TrackSchema };
