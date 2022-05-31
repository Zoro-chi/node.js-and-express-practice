// WEBSITE : https://zellwk.com/blog/crud-express-mongodb/

const express = require("express");
const bodyParser = require("body-parser");
const req = require("express/lib/request");
const MongoClient = require("mongodb").MongoClient;
const app = express();

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));
// TELLS EXPRESS TO MAKE THE PUBLIC FOLDER ACCESSIBLE TO THE PUBLIC
app.use(express.static("public"));
// TELLS SERVER TO USE JSON TO PARSE
app.use(bodyParser.json());
// THIS TELLS EXPRESS TO USE EJS AS TEMPLATE ENGINE
app.set("view engine", "ejs");

// app.listen(3000, () => {
//   console.log("Listening on 3000");
// });

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// app.post("/quotes", (req, res) => {
//   console.log(req.body);
// });

// CONNECTING TO MONGODB DB
const connectionString =
  "mongodb+srv://marimo:marimo@atlascluster.mxgmp.mongodb.net/?retryWrites=true&w=majority";

// CONNECT TO MONGODB
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    // NAME DB goingMerry
    const db = client.db("goingMerry");
    // CREATES A COLLECTION
    const quoteCollection = db.collection("quotes");

    quoteCollection
      .findOneAndUpdate(
        { name: "first" },
        {
          $set: {
            // name: req.body.name,
            // quote: req.body.quote,
          },
        },
        {
          upsert: true,
        }
      )
      .then((result) => console.log(result))
      .catch((err) => console.error(err));

    app.listen(3000, () => {
      console.log("Listening on 3000");
    });

    app.get("/", (req, res) => {
      // res.sendFile(__dirname + "/index.html");
      // GETS ALL THE QOUTES FROM DB
      db.collection("quotes")
        .find()
        .toArray()
        .then((result) => {
          // RENDERS HTML
          res.render("index.ejs", { quotes: result });
        })
        .catch((err) => console.log(err));
    });

    app.post("/quotes", (req, res) => {
      // SAVES QUOTE TO COLLECTION ON DB
      quoteCollection
        .insertOne(req.body)
        .then((result) => {
          // console.log(result);
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
      // console.log(req.body);
    });

    app.put("/quotes", (req, res) => {
      quoteCollection
        .findOneAndUpdate(
          { name: "first" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => res.json("success"))
        .catch((err) => console.error(err));
    });

    app.delete("/quotes", (req, res) => {
      quoteCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json('Deleted Darth Vadar"s quote');
        })
        .catch((err) => console.error(err));
    });
  })
  .catch((error) => console.error(error));
