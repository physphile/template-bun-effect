import { HttpApiGroup, HttpApiSwagger, HttpMiddleware, HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer } from "effect";

import { DatabaseLive } from "./database";
import { usersTable } from "./database/schemas/schema";
import { generateEndpoints } from "./helpers";

const router = HttpRouter.empty.pipe(HttpRouter.mount("/users", generateEndpoints(usersTable)));

const app = router.pipe(
	Effect.catchTag("NotFoundError", error => HttpServerResponse.json({ detail: error.message }, { status: 404 })),
	HttpServer.serve(HttpMiddleware.logger),
	HttpServer.withLogAddress
);

const MyApi = HttpApi.make("MyApi").add(
  HttpApiGroup.make("Users").add(
    HttpApiEndpoint.get("hello-world")`/`.addSuccess(Schema.String)
  )
)

const port = 3000;

const ServerLive = BunHttpServer.layer({ port });
const SwaggerLive = HttpApiSwagger.layer({
	path: "/docs",
});

const AppLive = Layer.mergeAll(DatabaseLive, ServerLive, SwaggerLive);

BunRuntime.runMain(Layer.launch(Layer.provide(app, AppLive)));
