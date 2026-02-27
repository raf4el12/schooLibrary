require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./router");
const { startOverdueChecker } = require("./cron/overdue-checker");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  startOverdueChecker();
});
