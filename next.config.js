const withLess = require("next-with-less");

module.exports = withLess({
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
