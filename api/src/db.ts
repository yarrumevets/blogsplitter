import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.query("SELECT NOW()")
  .then(({ rows }) => {
    console.log("Postgres connected:", rows[0].now);
  })
  .catch((error) => {
    console.error("Postgres connection failed:", error);
  });

export default db;
