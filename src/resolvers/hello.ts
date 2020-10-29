import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloResolvers {
  @Query()
  hello(): string {
    return 'hello, graph!';
  }
}
