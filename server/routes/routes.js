import express, { application } from "express";
import { test } from "../schema.js";
import cors from "cors";

export const router = express.Router();
const app = express();
app.use(cors());

router.get("/all", async (req, res) => {
  try {
    const data = await test.find();
    return res.json(data);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
    console.log(error.message);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { id, name, squad } = req.body;
    const newData = await test.create({ id, name, squad });
    res.json(newData);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/specific/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await test.findOne({ id });
    res.json(data);
  } catch (error) {
    console.log(error.message);
  }
});
