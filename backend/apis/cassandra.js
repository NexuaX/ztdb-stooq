import express from "express";
import cassandra from "cassandra-driver";

export const router = express.Router();

const client = new cassandra.Client({
  contactPoints: ["localhost"],
  localDataCenter: "datacenter1",
  keyspace: "ztbd",
});

router.get("/cassandra", async (req, res, next) => {
  const result = await client.execute("desc tables");
  res.json({
    message: "Dostępne tabelki",
    tables: result.rows,
  });
});

router.get("/cassandra/status", async (req, res, next) => {
  const result = await client.execute(
    "select cluster_name, cql_version, data_center from system.local"
  );
  res.json({
    message: "Cassandra ROCKS!",
    connection: client.hosts,
    keyspace: client.keyspace,
    version: result.rows,
  });
});

router.get("/cassandra/company", async (req, res, next) => {
  const result = await client.execute("select * from indexes");
  res.json({
    message: "Available company indexes",
    indexes: result.rows,
  });
});

router.get("/cassandra/company/:index", async (req, res, next) => {
  const index = req.params.index;

  const limit = req.query.limit ?? 5;

  const result = await client.execute(
    `select index_name, closing, highest, lowest, opening, volume, garbage
     from index_company_data where index_name = ? limit ${Number(limit)}`,
    [index]
  );

  result.rows.forEach(row => {
    row.garbage = row.garbage.length
  })

  res.json({
    message: index + " index",
    indexes: result.rows,
  });
});

router.get("/cassandra/index", async (req, res, next) => {
    const result = await client.execute("select * from indexes");
    res.json({
        message: "Available indexes",
        indexes: result.rows,
    });
});

router.get("/cassandra/index/:index", async (req, res, next) => {
  const index = req.params.index;

  const result = await client.execute(
      `select * from index_data limit ${req.query.limit ?? 5}`
  );

  res.json({
      message: index + " index",
      indexes: result.rows,
  });
});

router.post("/cassandra/execute", async (req, res, next) => {
  const query = req.body.query;

  let result = "Query not specified!";
  let status = 500;
  if (query) {
    try {
      // eg. query: "insert into indexes (index_name, full_name) values ('test', 'test')"
      console.log("Cassandra Executing:", query);
      await client.execute(query);
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
