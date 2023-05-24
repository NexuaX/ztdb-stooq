import express from "express";
import pg from "pg";

export const router = express.Router();
const client = new pg.Client({ user: "postgres", password: "password" });

await client.connect();

router.get("/postgres", async (req, res, next) => {
  const result = await client.query(`
        SELECT
            table_schema || '.' || table_name
        FROM
            information_schema.tables
        WHERE
            table_type = 'BASE TABLE'
        AND
            table_schema NOT IN ('pg_catalog', 'information_schema')
    `);
  res.json({ message: "Dostępne tabelki", tables: result.rows });
});

router.get("/postgres/status", async (req, res, next) => {
  const result = await client.query("SELECT version()");
  res.json({ message: "Postgres, it's a classic!", version: result });
});

router.get("/postgres/company", async (req, res, next) => {
  const result = await client.query("select * from indexes");
  res.json({
    message: "Result",
    result: result.rows,
  });
});

router.get("/postgres/company/:index", async (req, res, next) => {
  const index = req.params.index;
  const result = await client.query(`
        select index_data.* from index_data join indexes using(index_id) 
        where index_name = '${index}'
    `);

  res.json({
    message: index + " index",
    result: result.rows,
  });
});

router.post("/postgres/execute", async (req, res, next) => {
  const query = req.body.query;

  let result = "Query not specified!";
  if (query) {
    result = await client.query(query);
  }

  res.json({
    message: "Query result",
    resutl: result,
  });
});
