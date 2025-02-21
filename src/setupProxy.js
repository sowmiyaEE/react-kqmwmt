const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // The path to proxy
    createProxyMiddleware({
      target: 'https://react-kqmwmt.vercel.app',  
      changeOrigin: true,
    })
  );
};
