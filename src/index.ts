import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolvers } from './resolvers/hello';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  /* mikroConfigを元にマイグレーションする -> DB作成 */
  await orm.getMigrator().up();

  /* Expressサーバーの作成 */
  const app = express();

  /* ApolloServerの作成 */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolvers],
      validate: false,
    }),
  });

  /* ApolloServerのミドルウェアとしてExpressを登録 */
  apolloServer.applyMiddleware({ app });

  /* サーバーの起動 */
  app.listen(4000, () => {
    console.log('----------< サーバー起動: localhost:4000 >---------- ');
  });

  /* Postを作成してinsertする */
  // const post = orm.em.create(Post, { title: 'my first post!' });
  // await orm.em.persistAndFlush(post);

  /* 全てのPOSTをクエリする */
  // const posts = await orm.em.find(Post, {});
};

main().catch((err) => {
  console.log(err);
});
