import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface IArtist extends Document {
  artistId: number;
  location: string | null;
  name: string | null;
  // tracks:
  username: string | null;
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
  username: { type: String, index: true }
});

export default mongoose.model<IArtist>("Artist", ArtistSchema);
