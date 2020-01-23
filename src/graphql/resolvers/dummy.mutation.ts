import { Resolver, Mutation } from 'type-graphql';

@Resolver()
class DummyMutationResolver {
  @Mutation()
  noop(): string {
    return 'hi';
  }
}

export default DummyMutationResolver;
