const mongoose = require("mongoose");

const { PRODUCTION, DB_USER, DB_PASSWORD } = process.env;
const DB_NAME = "arabsoverflow";

const CONNECTION_URL = PRODUCTION
  ? `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.emopc.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
  : `mongodb://localhost:27017/${DB_NAME}`;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database successfully"))
  .catch(() => console.log("Failed to connected to the database"));
