import express from "express"

export const router = express.Router()

router.get("/postgres", (req, res, next) => {
    res.json("Postgres, it's a classic!")
})
