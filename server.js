const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const uuid = require("./helpers/uuid");
// const notes = require("./db/db.json");???
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serves css/js/static assets
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  // res.json(`${req.method} request received to get reviews`);

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    const notes = JSON.parse(data);
    console.log(notes);
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      } else {
        const notes = JSON.parse(data);
        console.log(req.body);
        notes.push(newNote);
        const notesString = JSON.stringify(notes);
        fs.writeFile(
          "./db/db.json",
          notesString,
          (err, data) => (err) =>
            err
              ? console.error(err)
              : console.log(`Note has been written to JSON file`)
        );
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting notes");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  console.log(req.method, req.url);
  res.send("delete request to /notes");
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const notes = JSON.parse(data);
      const filtered = notes.filter((notes) => notes.id != req.params.id);
      // res.send(filtered);
      const notesString = JSON.stringify(filtered);
      console.log(notesString);
      fs.writeFile(
        "./db/db.json",
        notesString,
        (err, data) => (err) =>
          err ? console.error(err) : console.log(`Note has been deleted`)
      );
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("listening to port " + PORT);
});
