import dotenv from "dotenv"
import { connectToDB } from "./config/db.js";
import express from "express"
import { test } from "./schema.js";
import { router } from "./routes/routes.js";
import cors from "cors"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use("/api", router)

const starter = async() => {
    try {
        await connectToDB()
        app.listen(3000, () => {
            console.log("I'm listening")
        })
        const res = await test.find()
        console.log(res)
    } catch (error) {
        console.log(error.message)
    }
}

starter()