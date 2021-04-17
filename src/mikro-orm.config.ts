import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Ticket } from "./entities/Ticket";
import path from "path";

const config = {
  dbName: "dev_support",
  user: "postgres",
  password: "postgres",
  debug: !__prod__,
  type: "postgresql",
  entities: [Ticket],
  migrations: {
    path: path.join(__dirname, "migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];

export default config;
