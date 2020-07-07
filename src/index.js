require("./util/db");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");

const app = express();

app.set("view engine", "ejs");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(auth);
app.use(require("./routes/router"));

const PORT = process.env["PORT"] || 3000;

const server = app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
