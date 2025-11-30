import type { SQLiteTable, SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";

import { HttpRouter, HttpServerRequest, HttpServerResponse } from "@effect/platform";
import { RouteNotFound } from "@effect/platform/HttpServerError";
import {
	type Column,
	type ColumnBaseConfig,
	type ColumnDataNumberConstraint,
	type ColumnDataStringConstraint,
	eq,
	type TableConfig,
} from "drizzle-orm";
import { Data, Effect, Schema } from "effect";

import { SqliteDrizzle } from "./database";

export class NotFoundError extends Data.TaggedError("NotFoundError")<{
	message: string;
}> {}

export const Params = Schema.Struct({
	id: Schema.String,
});

export const getMany = <T extends SQLiteTable>(table: T) =>
	Effect.gen(function* () {
		const db = yield* SqliteDrizzle;

		const fields = yield* Effect.promise(() => db.select().from(table));

		return fields;
	});

type EntityWithId = SQLiteTableWithColumns<
	TableConfig<{
		id: Column<ColumnBaseConfig<`number ${ColumnDataNumberConstraint}` | `string ${ColumnDataStringConstraint}`>>;
	}>
>;

export const getById = <T extends EntityWithId>(table: T, id: number) =>
	Effect.gen(function* () {
		const db = yield* SqliteDrizzle;

		const fields = yield* Effect.promise(() => db.select().from(table).where(eq(table.id, id)));

		const field = fields.at(0);

		if (field === undefined) {
			return yield* Effect.fail(new NotFoundError({ message: `Entity with id ${id} not found` }));
		}

		return field;
	});

export const generateEndpoints = (table: EntityWithId) =>
	HttpRouter.empty.pipe(
		HttpRouter.get("/", getMany(table).pipe(Effect.flatMap(HttpServerResponse.json))),
		HttpRouter.get(
			`/:id`,
			HttpRouter.schemaPathParams(Params).pipe(
				Effect.flatMap(params =>
					Effect.gen(function* () {
						if (Number.isNaN(Number(params.id))) {
							const req = yield* HttpServerRequest.HttpServerRequest;
							return yield* Effect.fail(new RouteNotFound({ request: req }));
						}

						return params;
					})
				),
				Effect.flatMap(params => getById(table, Number(params.id))),
				Effect.flatMap(HttpServerResponse.json)
			)
		)
	);
