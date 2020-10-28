import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import mikroConfig from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  /* mikroConfigを元にマイグレーションする -> DB作成 */
  await orm.getMigrator().up();

  /* Postを作成してinsertする */
  // const post = orm.em.create(Post, { title: 'my first post!' });
  // await orm.em.persistAndFlush(post);

  /* 全てのPOSTをクエリする */
  const posts = await orm.em.find(Post, {});
  console.log(posts);
  console.table(posts);
};

main().catch((err) => {
  console.log(err);
});
