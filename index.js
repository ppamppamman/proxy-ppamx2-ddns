const app = require("express")();
const api = require("./api");

const { IPTIME_DDNS, IPTIME_TOKEN, IPTIME_MAC, PORT_FOR_ACCESS } = process.env;

const { createProxyMiddleware } = require("http-proxy-middleware");

app.use("/api", api);

// proxyReqPathResolver: function (req) {
//       return req.url + `cgi-bin/wol_apply.cgi?act=wakeup&mac=${IPTIME_MAC}`;
//     },
const proxy = createProxyMiddleware({
  pathFilter: "/wol3",
  onProxyReq: function (proxyReq, req, res) {
    proxyReq.setHeader("Authorization", `Basic ${IPTIME_TOKEN}`);
  },
  target: `${IPTIME_DDNS}:${PORT_FOR_ACCESS}/cgi-bin/wol_apply.cgi?act=wakeup&mac=${IPTIME_MAC}`,
  // router: function (req) {
  //   return `${IPTIME_DDNS}:${PORT_FOR_ACCESS}/cgi-bin/wol_apply.cgi?act=wakeup&mac=${IPTIME_MAC}`;
  // },
});

app.use("/wol3", proxy);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
