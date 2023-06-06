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

router.post("/cassandra/execute", async (req, res, next) => {
  const query = req.body.query;

  let result = "Query not specified!";
  let status = 500;
  if (query) {
    try {
      // eg. query: "insert into indexes (index_name, full_name) values ('test', 'test')"
      console.log("Cassandra Executing:", query);
      await client.execute(query);
      status = 200;
      result = "Query Ok.";
    } catch (err) {
      result = "Query error. See console.";
      console.log(err);
    }
  }

  res.status(status).json({
    message: result,
  });
});

// TEST CASE 1
router.get("/cassandra/index", async (req, res, next) => {
  const result = await client.execute(
    `select * from index_data limit ${Number(req.query.limit) ?? 100}`
  );

  result.rows.forEach((row) => {
    delete row.garbage;
  });

  res.json({
    message: index + " index",
    indexes: result.rows,
  });
});

//TEST CASE 2
router.get("/cassandra/company/:index", async (req, res, next) => {
  const index = req.params.index;

  const limit = Number(req.query.limit) ?? 100;

  const result = await client.execute(
    `select index_name, day, closing, highest, lowest, opening, volume, garbage
     from index_company_data where index_name = ? limit ${Number(limit)}`,
    [index]
  );

  result.rows.forEach((row) => {
    delete row.garbage;
  });

  res.json({
    message: index + " index",
    result: result.rows,
  });
});

//TEST CASE 3
router.get("/cassandra/company/:index/sorted", async (req, res, next) => {
  const index = req.params.index;

  const limit = Number(req.query.limit) ?? 100;

  const result = await client.execute(
    `select index_name, day, closing, highest, lowest, opening, volume, garbage
     from index_company_data where index_name = ? order by day desc limit ${Number(
       limit
     )}`,
    [index]
  );

  result.rows.forEach((row) => {
    delete row.garbage;
  });

  res.json({
    message: index + " index",
    indexes: result.rows,
  });
});

//TEST CASE 4
router.get("/cassandra/company/:index/avg", async (req, res, next) => {
  const index = req.params.index;

  const result = await client.execute(
    `   select 
          index_name,
          avg(closing) as avg_closing,
          avg(opening) as avg_opening,
          avg(highest) as avg_highest,
          avg(lowest) as avg_lowest
        from
          index_company_data 
        where index_name  = ?
        group by index_name`,
    [index]
  );

  res.json({
    message: index + " index",
    indexes: result.rows,
  });
});

//TEST CASE 5
router.get("/cassandra/company/:index/filter", async (req, res, next) => {
  const index = req.params.index;
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;

  const result = await client.execute(
    `
    select index_name, day, closing, highest, lowest, opening, volume, garbage
        from index_company_data 
        where index_name = ? and day >= '${startDate}' and day <= '${endDate}'
    `,
    [index]
  );

  result.rows.forEach((row) => {
    delete row.garbage;
  });

  res.json({
    message: index + " index",
    indexes: result.rows,
  });
});

//TEST CASE 6
router.post("/cassandra/company/:index/update", async (req, res, next) => {
  const index = req.params.index;

  const date = req.body.date;
  const volume = Number(req.body.volume);

  const result = await client.execute(
    `
      update index_company_data set volume = ${volume} 
      where index_name = ? and day = '${date}'
    `,
    [index]
  );

  res.json({
    message: index + " index",
    indexes: result.rows,
  });
});

//TEST CASE 7
router.delete("/cassandra/company/:index", async (req, res, next) => {
  const index = req.params.index;

  const date = req.query.date;

  const result = await client.execute(
    `
      delete from index_company_data 
      where index_name = ? and day = '${date}' if exists
    `,
    [index]
  );

  res.json({
    message: index + " index",
    indexes: result.rows,
  });
});

//TEST CASE 8
router.post("/cassandra/company/:index/insert", async (req, res, next) => {
  const index = req.params.index;

  const day = req.body.day;
  const volume = req.body.volume;
  const open = req.body.open;
  const close = req.body.close;
  const high = req.body.high;
  const low = req.body.low;

  const result = await client.execute(
    `
      insert into index_company_data (index_name, day, volume, opening, closing, highest, lowest) 
      values ('${index}', '${day}', ${volume}, ${open}, ${close}, ${high}, ${low})
    `
  );

  res.json({
    message: index + " index",
    indexes: result.rows,
  });
});
