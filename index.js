const app = require("express")();
const api = require("./api");

const { IPTIME_DDNS, IPTIME_TOKEN, IPTIME_MAC, PORT_FOR_ACCESS } = process.env;

const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({});

proxy.on("proxyReq", function (proxyReq, req, res, options) {
  proxyReq.setHeader("Authorization", `Basic ${IPTIME_TOKEN}`);
});

app.use("/api", api);

// proxyReqPathResolver: function (req) {
//       return req.url + `cgi-bin/wol_apply.cgi?act=wakeup&mac=${IPTIME_MAC}`;
//     },

app.get("/wol3/*", (req, res) => {
  proxy.web(req, res, {
    target: `${IPTIME_DDNS}:${PORT_FOR_ACCESS}/`,
    query: {
      act: "wakeup",
      mac: IPTIME_MAC,
    },
  });
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
