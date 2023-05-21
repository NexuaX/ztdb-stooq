import express from "express"
import cassandra from "cassandra-driver"

export const router = express.Router()

const client = new cassandra.Client({
    contactPoints: ["localhost"],
    localDataCenter: 'datacenter1',
    keyspace: 'ztbd'
}) 

router.get("/cassandra", async (req, res, next) => {
    const result = await client.execute("desc tables")
    res.json({
        message: "Dostępne tabelki",
        tables: result.rows
    })
})

router.get("/cassandra/status", async (req, res, next) => {
    const result = await client.execute("select cluster_name, cql_version, data_center from system.local")
    res.json({
        message: "Cassandra ROCKS!", 
        connection: client.hosts,
        keyspace: client.keyspace,
        version: result.rows 
    })
})

router.get("/cassandra/setup", async (req, res, next) => {
    const resultList = []
    let result
    
    result = await client.execute(`
        CREATE TABLE if not exists ztbd.index_company (
            index_name text PRIMARY KEY,
            full_name text
        )
    `)
    resultList.push(result)

    result = await client.execute(`
        CREATE TABLE if not exists ztbd.index_company_data (
            index_name text,
            day date,
            closing decimal,
            highest decimal,
            lowest decimal,
            opening decimal,
            volume decimal,
            PRIMARY KEY (index_name, day)
        ) WITH CLUSTERING ORDER BY (day DESC)
    `)
    resultList.push(result)

    res.json({
        message: "Result", 
        result: result
    })
})

router.get("/cassandra/company", async (req, res, next) => {
    const result = await client.execute("select * from index_company")
    res.json({
        message: "Available company indexes",
        indexes: result.rows
    })
})

router.get("/cassandra/company/:index", async (req, res, next) => {
    const index = req.params.index

    const result = await client.execute("select * from index_company_data where index_name = ? limit 20", [index])
    res.json({
        message: index + " index",
        indexes: result.rows
    })
})

router.post("/cassandra/execute", async (req, res, next) => {
    const query = req.body.query

    let result = "Query not specified!"
    if (query) {
        result = await client.execute(query)
    }

    res.json({
        message: "Query result",
        resutl: result
    })
})
