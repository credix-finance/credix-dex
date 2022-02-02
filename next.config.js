const withLess = require("next-with-less");

module.exports = withLess({
  assetPrefix: './', 
  lessLoaderOptions: {
    javascriptEnabled: true,
    /* ... */
    lessOptions: {
      /* ... */
      modifyVars: {
      },
    },
  },
});
