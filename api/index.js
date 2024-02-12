const app = require("express")();
const proxy = require("express-http-proxy");
require("dotenv").config();

const { v4 } = require("uuid");

const {
  IPTIME_DDNS,
  IPTIME_TOKEN,
  IPTIME_MAC,
  PORT_FOR_ACCESS,
  PORT_FOR_SLEEP,
} = process.env;

app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

app.get("/api/wol", (req, res) => {
  proxy(
    `${IPTIME_DDNS}:${PORT_FOR_ACCESS}/cgi-bin/wol_apply.cgi?act=wakeup&mac=${IPTIME_MAC}`,
    {
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // you can update headers
        proxyReqOpts.headers["Authorization"] = `Basic ${IPTIME_TOKEN}`;
        return proxyReqOpts;
      },
    }
  );
  res.end(`api/wol success`);
});

app.get("/api/sleep", (req, res) => {
  proxy(`${IPTIME_DDNS}:${PORT_FOR_SLEEP}/`);
  res.end(`api/sleep success`);
});

module.exports = app;
