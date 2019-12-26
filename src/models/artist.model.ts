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
  name: String,
  tracks: [{ type: Schema.Types.ObjectId, ref: "Track" }],
  username: String
});

export default mongoose.model<IArtist>("Artist", ArtistSchema);
