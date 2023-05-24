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

  const result = await client.execute(
    `select index_name, closing, highest, lowest, opening, volume from index_company_data where index_name = ?`,
    [index]
  );
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
        "select index_name, closing, highest, lowest, opening, volume from index_data limit 100"
    );
    res.json({
        message: index + " index",
        indexes: result.rows,
    });
});

router.post("/cassandra/execute", async (req, res, next) => {
  const query = req.body.query;

  let result = "Query not specified!";
  if (query) {
    result = await client.execute(query);
  }

  res.json({
    message: "Query result",
    resutl: result,
  });
});
