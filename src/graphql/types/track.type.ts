import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType('Track')
class TrackGQLType {
  @Field(type => ID)
  id: string;

  @Field({ nullable: true })
  path: string;

  @Field()
  round: number;

  artistID: string;
}

export default TrackGQLType;
