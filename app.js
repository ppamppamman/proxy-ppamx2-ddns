const app = require("express")();
const api = require("./api");
require("dotenv").config();

app.use("/api", api);

module.exports = app;
