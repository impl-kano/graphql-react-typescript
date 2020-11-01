import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolvers } from './resolvers/hello';
import { PostResolvers } from './resolvers/posts';
import { UserResolvers } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  /* mikroConfigを元にマイグレーションする -> DB作成 */
  // await orm.getMigrator().up();

  /* Expressサーバーの作成 */
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: 'testsessionforlearninggraphql',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: __prod__, // coolie only works with https
        sameSite: 'lax', // csrf
      },
      saveUninitialized: false,
      secret: 'thisisatestforlearningperpose',
      resave: false,
    }),
  );

  /* ApolloServerの作成 */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolvers, PostResolvers, UserResolvers],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  /* ApolloServerのミドルウェアとしてExpressを登録 */
  apolloServer.applyMiddleware({ app });

  /* サーバーの起動 */
  app.listen(4000, () => {
    console.log('----------< サーバー起動: localhost:4000 >---------- ');
  });
};

main().catch((err) => {
  console.log(err);
});
