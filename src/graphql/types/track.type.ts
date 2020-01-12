import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
class Track {
  @Field(type => ID)
  id: string;

  @Field({ nullable: true })
  path: string;

  @Field()
  round: number;

  @Field(type => ID)
  artistID: string;
}

export default Track;
