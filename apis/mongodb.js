import express from "express"
import mongodb from "mongodb"

export const router = express.Router()

const url = "mongodb://root:example@localhost:27017"
const client = new mongodb.MongoClient(url)

router.get("/mongodb", async (req, res, next) => {
    const db = client.db('ztbd')
    const result = await db.command({
        serverStatus: 1
    })
    res.json({message: "MongoDB hehe..", info: result})
})
