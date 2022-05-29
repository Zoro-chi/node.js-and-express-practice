const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Listening on 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/quotes", (req, res) => {
  console.log(req.body);
});

const connectionString =
  "mongodb+srv://marimo:marimo@atlascluster.mxgmp.mongodb.net/?retryWrites=true&w=majority";
MongoClient.connect(
  connectionString,
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.error(err);
    console.log("connected to the database");
  }
);
