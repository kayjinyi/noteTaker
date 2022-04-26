const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");

//serves css/js/static assets
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const note = JSON.parse(data);
      res.json(note);
    }
  });
});

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const people = JSON.parse(data);
      console.log(req.body);
      people.push(req.body);
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(people, null, 2),
        (err, data) => {
          if (err) {
            throw err;
          } else {
            res.json(people);
          }
        }
      );
    }
  });
});

// app.delete("/api/notes/:id", (req, res) => {
//   console.log(req.method, req.url);
//   res.send("delete request to /animals");
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("listening to port " + PORT);
});
