import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), '.env') });

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/Schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://motifvb:eN7:xC6*oF4[hM0]@europe-west1-001.proxy.kinsta.app:30665/motifv",
  },
});