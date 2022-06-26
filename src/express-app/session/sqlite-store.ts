import session from 'express-session';
import sqliteStoreFactory from 'express-session-sqlite';
import sqlite3 from 'sqlite3';
import { Service } from 'typedi';

import { ConfigService } from 'config';

@Service()
export class SqlLiteSessionStorage {
  // SqliteStore doesn't ahve any return type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public store;

  constructor(private configService: ConfigService) {
    const SqliteStore = sqliteStoreFactory(session);

    this.store = new SqliteStore({
      // Database library to use. Any library is fine as long as the API is compatible
      // with sqlite3, such as sqlite3-offline
      driver: sqlite3.Database,
      // for in-memory database
      // path: ':memory:'
      path: this.configService.sqlitePath,
      // Session TTL in milliseconds
      ttl: 3000000,
      // (optional) Session id prefix. Default is no prefix.
      prefix: 'sess:',
      // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
      // Default is 50 minutes.
      cleanupInterval: 3000000,
    });
  }
}
