const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_URL,
      changeOrigin: true,
      // For some reason, using /api doesn't remove the /api path from
      // the request sent to the proxy address, so we have to remove it ourselves.
      pathRewrite: {'^/api' : ''},
    })
  );
};