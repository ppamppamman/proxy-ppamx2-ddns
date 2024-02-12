const express = require("express");
const axios = require("axios");
const proxy = require("express-http-proxy");
require("dotenv").config();

const {
  IPTIME_DDNS,
  IPTIME_TOKEN,
  IPTIME_MAC,
  PORT_FOR_ACCESS,
  PORT_FOR_SLEEP,
} = process.env;

const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="/">test</a>`);
});

router.get("/item/:slug", (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

router.use(
  "/wol2",
  proxy(`${IPTIME_DDNS}:${PORT_FOR_ACCESS}/cgi-bin/wol_apply.cgi`, {
    proxyReqPathResolver: function (req) {
      return req.url + "?act=wakeup&mac=${IPTIME_MAC}";
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers["Authorization"] = `Basic ${IPTIME_TOKEN}`;
      // you can change the method
      proxyReqOpts.method = "GET";
      return proxyReqOpts;
    },
  })
);

router.get("/wol", async (req, res) => {
  try {
    const result = await axios.get(
      `${IPTIME_DDNS}:${PORT_FOR_ACCESS}/cgi-bin/wol_apply.cgi?act=wakeup&mac=${IPTIME_MAC}`,
      {
        headers: {
          Authorization: `Basic ${IPTIME_TOKEN}`,
        },
      }
    );
    res.end(`api/wol success`);
  } catch (e) {
    res.status(500).send(`api/wol error ${JSON.stringify(e)}`);
  }
});

router.get("/sleep", async (req, res) => {
  try {
    await axios.get(`${IPTIME_DDNS}:${PORT_FOR_SLEEP}/`);
    res.end(`api/sleep success`);
  } catch (e) {
    res.status(500).send("api/sleep error");
  }
});

module.exports = router;
