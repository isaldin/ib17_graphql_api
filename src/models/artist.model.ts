import { Document, model, Model, Schema, Types } from "mongoose";

import { ITrackModel, TrackModel } from "@app/models/track.model";
import { reduce, sum, map, prop } from "ramda";

interface IArtistModel extends Document {
  _id: Types.ObjectId;
  artistId: number;
  username: string;
  name: string | null;
  location: string | null;
  tracks: Array<ITrackModel>;
  overallJudgesRating: number;
  overallPopularRating: number;
}

const ArtistSchema: Schema = new Schema(
  {
    artistId: {
      required: true,
      type: Number,
      unique: true
    },
    username: { type: String, index: true, required: true },
    name: { type: String, index: true },
    location: String,
    tracks: [{ type: Schema.Types.ObjectId, ref: "Track" }]
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

ArtistSchema.pre("find", function(this: IArtistModel, next) {
  this.populate("tracks");
  next();
});

ArtistSchema.pre("findOne", function(this: IArtistModel, next) {
  this.populate("tracks");
  next();
});

ArtistSchema.virtual("overallJudgesRating").get(function(
  this: IArtistModel
): number {
  return sum(map(prop("judges_rating"), this.tracks));
});

ArtistSchema.virtual("overallPopularRating").get(function(
  this: IArtistModel
): number {
  return sum(map(prop("popular_rating"), this.tracks));
});

const ArtistModel: Model<IArtistModel> = model<IArtistModel>(
  "Artist",
  ArtistSchema
);

export { ArtistModel, IArtistModel };
