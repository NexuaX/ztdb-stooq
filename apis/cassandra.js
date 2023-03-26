import express from "express"

export const router = express.Router()

router.get("/cassandra", (req, res, next) => {
    res.json("Cassandra ROCKS!")
})
