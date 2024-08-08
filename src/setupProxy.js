const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://chatify-api.up.railway.app",
      changeOrigin: true,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers["Content-Security-Policy"] =
          "default-src 'self'; img-src 'self' https://i.pravatar.cc";
      },
    })
  );
};
