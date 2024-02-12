const app = require("express")();
const api = require("./api");
const proxy = require("express-http-proxy");

const { IPTIME_DDNS, IPTIME_TOKEN, IPTIME_MAC, PORT_FOR_ACCESS } = process.env;

app.use("/api", api);

app.use(
  "/wol3",
  proxy(`${IPTIME_DDNS}:${PORT_FOR_ACCESS}/`, {
    proxyReqPathResolver: function (req) {
      console.log(
        req.url + `cgi-bin/wol_apply.cgi?act=wakeup&mac=${IPTIME_MAC}`
      );
      return req.url + `cgi-bin/wol_apply.cgi?act=wakeup&mac=${IPTIME_MAC}`;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers["Authorization"] = `Basic ${IPTIME_TOKEN}`;
      // you can change the method
      proxyReqOpts.method = "GET";
      proxyReqOpts.path = proxyReqOpts.path + `?act=wakeup&mac=${IPTIME_MAC}`;
      console.log(proxyReqOpts);
      return proxyReqOpts;
    },
  })
);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
