dotenv.config();

import express from "express";
import dotenv from "dotenv";
import vacancies from "./routes/Vacancies.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/static", express.static("public"));

app.use("/vacancies", vacancies);

app.get("/", (req, res) => {
  res.json("main");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
