import { HttpMiddleware, HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer } from "effect";

import { DatabaseLive } from "./database";
import { usersTable } from "./database/schemas/schema";
import { generateEndpoints } from "./helpers";

const router = HttpRouter.empty.pipe(HttpRouter.mount("/users", generateEndpoints(usersTable)));

const app = router.pipe(
  Effect.catchTag("NotFoundError", error => HttpServerResponse.json({ detail: error.message }, { status: 404 })),
  HttpServer.serve(HttpMiddleware.logger),
  HttpServer.withLogAddress,
);

const port = 3000;

const ServerLive = BunHttpServer.layer({ port });

const AppLive = Layer.mergeAll(DatabaseLive, ServerLive);

BunRuntime.runMain(Layer.launch(Layer.provide(app, AppLive)));
