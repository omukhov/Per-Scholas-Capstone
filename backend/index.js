import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.json("main");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
