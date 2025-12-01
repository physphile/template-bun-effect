import "dotenv/config";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";

import { make } from "@effect/sql-drizzle/Sqlite";
import { SqliteClient } from "@effect/sql-sqlite-bun";
import { Config, Context, Layer } from "effect";

import { type Schema, schema } from "./schemas";

const SqliteLive = SqliteClient.layerConfig({
  filename: Config.string("DB_FILE_NAME"),
});

export class SqliteDrizzle extends Context.Tag("ganza/sql-drizzle/Sqlite")<
  SqliteDrizzle,
  SqliteRemoteDatabase<Schema>
>() {}

const DrizzleLive = Layer.scoped(SqliteDrizzle, make({ schema }));

export const DatabaseLive = Layer.provide(DrizzleLive, SqliteLive);
