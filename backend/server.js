import express from "express"

export const app = express()
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

app.set('json spaces', 2)

app.get("/", (req, res, nest) => {
    res.json(
        {
            ProjectBy: ["Jan Nowakowski", "Mateusz Kutek", "Albert Mouhoubi"],
            Serving: ["MongoDB", "PostgreSQL", "Cassandra"]
        }
    )
})

import { router as router_cassandra } from "./apis/cassandra.js"
import { router as router_mongodb } from "./apis/mongodb.js"
import { router as router_postgres } from "./apis/postgres.js"
app.use(router_cassandra)
app.use(router_mongodb)
app.use(router_postgres)
