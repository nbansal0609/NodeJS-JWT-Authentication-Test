const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const PORT = 3000;
const secretKey = "My super secret key";
const jwtMW = expressJwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

let users = [
  {
    id: 1,
    username: "Fabio",
    password: "123",
  },
  {
    id: 2,
    username: "Nolasco",
    password: "457",
  },
  {
    id: 3,
    username: "Nikhil",
    password: "123",
  },
  {
    id: 4,
    username: "Bansal",
    password: "456",
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  for (let user of users) {
    if (username === user.username && password === user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "3m" }
      );
      return res.json({
        success: true,
        err: null,
        token,
      });
    }
  }
  return res.status(401).json({
    success: false,
    token: null,
    err: "Username or password is incorrect",
  });
});

app.get("/api/dashboard", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret content that only logged in people can access.",
  });
});

app.get("/api/settings", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Settings content that only logged in people can access.",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Username or password is incorrect 2",
    });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log("Serving on port 3000");
});
