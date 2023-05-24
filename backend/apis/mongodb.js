import express from "express";
import mongodb from "mongodb";

export const router = express.Router();

const url = "mongodb://root:example@localhost:27017";
const client = new mongodb.MongoClient(url);
const db = client.db("ztbd");

router.get("/mongodb", async (req, res, next) => {
  const result = await db.command({
    listCollections: 1,
    authorizedCollections: true,
    nameOnly: true,
  });

  res.json({
    message: "MongoDB hehe..",
    info: result,
  });
});

router.get("/mongodb/status", async (req, res, next) => {
  const result = await db.command({
    serverStatus: 1,
  });
  res.json({ message: "Jest jak jest", status: result });
});

router.get("/mongodb/company", async (req, res, next) => {
  const collection = await db.collection("indexes");
  const result = await collection.find().toArray()

  res.json({
    message: "Result",
    result: result,
  });
});

router.get("/mongodb/company/:index", async (req, res, next) => {
  const index = req.params.index;
  const collection = db.collection(index + "_data");
  const result = await collection.find().project({
    "index_name": 1, "closing": 1, "highest": 1, "lowest": 1, "opening": 1, "volume": 1
  }).toArray();

  res.json({
    message: index + " index",
    result: result,
  });
});

router.get("/mongodb/index", async (req, res, next) => {
  const collection = await db.collection("indexes");
  const result = await collection.find().toArray();

  res.json({
    message: "Result",
    result: result,
  });
});

router.get("/mongodb/index/:index", async (req, res, next) => {
  const index = req.params.index;
  const collection = db.collection(index + "_data");
  const result = await collection.find().project({
    "index_name": 1, "closing": 1, "highest": 1, "lowest": 1, "opening": 1, "volume": 1
  }).toArray();

  res.json({
    message: index + " index",
    result: result,
  });
});

router.post("/mongodb/execute", async (req, res, next) => {
  const query = req.body.query;

  let result = "Query not specified!";
  if (query) {
    result = db.query(query);
  }

  res.json({
    message: "Query result",
    resutl: result,
  });
});
