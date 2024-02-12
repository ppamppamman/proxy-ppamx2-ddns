const app = require("express")();
const api = require("./api");

app.use("/api", api);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
