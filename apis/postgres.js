import express from "express"
import pg from "pg"

export const router = express.Router()
const client = new pg.Client({user: "postgres", password: "password"})

await client.connect()

router.get("/postgres", async (req, res, next) => {
    const result = await client.query('SELECT version()')
    res.json({message: "Postgres, it's a classic!", version: result})
})
