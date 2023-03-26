import express from "express"

export const router = express.Router()

router.get("/mongodb", (req, res, next) => {
    res.json("MongoDB hehe..")
})
