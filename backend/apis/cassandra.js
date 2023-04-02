import express from "express"
import cassandra from "cassandra-driver"

export const router = express.Router()

const client = new cassandra.Client({
    contactPoints: ["localhost"],
    localDataCenter: 'datacenter1',
    keyspace: 'ztbd'
})

router.get("/cassandra", async (req, res, next) => {
    const result = await client.execute("select cluster_name, cql_version, data_center from system.local")
    res.json({
        status: "Cassandra ROCKS!", 
        connection: client.hosts,
        keyspace: client.keyspace,
        version: result.rows 
    })
})
