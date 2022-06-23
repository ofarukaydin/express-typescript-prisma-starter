import { Express } from 'express';
import session from 'express-session';
import sqliteStoreFactory from 'express-session-sqlite';
import sqlite3 from 'sqlite3';

import config from 'config';

export function initSession(app: Express) {
  const SqliteStore = sqliteStoreFactory(session);

  // TODO: Using sqlite store for now for faster development times. Migrate to redis in prod.
  app.use(
    session({
      secret: config.sessionSecret,
      saveUninitialized: false,
      resave: false,
      cookie: {
        sameSite: 'none',
        httpOnly: false,
        maxAge: 60000,
        secure: true,
      },
      store: new SqliteStore({
        // Database library to use. Any library is fine as long as the API is compatible
        // with sqlite3, such as sqlite3-offline
        driver: sqlite3.Database,
        // for in-memory database
        // path: ':memory:'
        path: '/tmp/sqlite.db',
        // Session TTL in milliseconds
        ttl: 3000000,
        // (optional) Session id prefix. Default is no prefix.
        prefix: 'sess:',
        // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
        // Default is 50 minutes.
        cleanupInterval: 3000000,
      }),
      unset: 'destroy',
    }),
  );
}

// export function initSession(app: Express) {
//   const RedisStore = ConnectRedis(session);
//   const redisClient = new Redis();

//   app.use(
//     session({
//       secret: config.sessionSecret,
//       saveUninitialized: false,
//       resave: false,
//       cookie: {
//         sameSite: 'none',
//         httpOnly: false,
//         maxAge: 60000,
//         secure: true,
//       },
//       store: new RedisStore({
//         client: redisClient,
//         ttl: 260,
//       }),
//       unset: 'destroy',
//     }),
//   );
// }
