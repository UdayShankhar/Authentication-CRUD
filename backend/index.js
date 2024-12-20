const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const speakeasy = require("speakeasy")
const uuid = require("uuid")
const { JsonDB, Config } = require("node-json-db");

const db = new JsonDB(new Config("myDataBase", true, false, "/"));

const port = process.env.PORT || 8000;

dotenv.config();
const mongodbUri = process.env.MONGO_URL;

mongoose.set("strictQuery", false);
mongoose
  .connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  )
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Node JS Backend");
});

app.listen(port, () => {
  console.log("Server is running at 8000");
});
