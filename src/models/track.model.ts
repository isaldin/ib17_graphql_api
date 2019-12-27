import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface ITrack extends Document {
  path: string;
}

const TrackSchema = new Schema({
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
  pair: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
  path: String,
  rating: Number,
  round: Number,
  table: { type: String, enum: ["in", "yan"] },
  won: Boolean
});

export default mongoose.model("Track", TrackSchema);
