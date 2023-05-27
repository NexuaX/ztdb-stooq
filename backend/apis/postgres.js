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
  const limit = req.query.limit ?? 5;
  const result = await client.query(`
        select index_company_data.*
        from index_company_data join indexes using(index_id) 
        where index_name = '${index}' limit ${limit}
    `);

  result.rows.forEach(row => {
    row.garbage = row.garbage.length
  })

  res.json({
    message: index + " index",
    result: result.rows,
  });
});

router.get("/postgres/index", async (req, res, next) => {
  const result = await client.query("select * from indexes");
  res.json({
    message: "Result",
    result: result.rows,
  });
});

router.get("/postgres/index/:index", async (req, res, next) => {
  const index = req.params.index;
  const limit = req.query.limit ?? 5;
  const result = await client.query(`
        select index_data.* 
        from index_data join indexes using(index_id) 
        where index_name = '${index}' limit ${limit}
    `);

  result.rows.forEach(row => {
    row.garbage = row.garbage.length
  })

  res.json({
    message: index + " index",
    result: result.rows,
  });
});

router.post("/postgres/execute", async (req, res, next) => {
  const query = req.body.query;

  let result = "Query not specified!";
  let status = 500;
  if (query) {
    try {
      // eg. query: "insert into indexes (index_name, full_name) values ('test', 'test')"
      console.log("Postgres Executing:", query);
      await client.query(query);
      status = 200
      result = "Query Ok."
    } catch (err) {
      result = "Query error. See console."
      console.log(err)
    }
  }

  res.status(status).json({
    message: result
  });
});
