import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (process.env.DB_FILE_NAME === undefined) {
  throw new Error("DB_FILE_NAME is not set");
}

export default defineConfig({
  dbCredentials: {
    url: process.env.DB_FILE_NAME,
  },
  dialect: "sqlite",
  out: "./drizzle",
  schema: "./src/database/schemas",
});
