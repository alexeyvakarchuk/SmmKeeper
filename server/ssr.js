/*
  ssr.js
  Responsible for server-side rendering and fetching
  appropriate assets for a given route
  Starts at `Function handleRender()`, called by the server
*/
const React = require("react");
const path = require("path");
const ReactDOMServer = require("react-dom/server");
const { Provider } = require("react-redux");
const { ConnectedRouter, push } = require("react-router-redux");
import { matchRoutes, renderRoutes } from "react-router-config";
import routes from "views/routes/Base/server";
import configureStore from "store";

const serialize = require("serialize-javascript");
const qs = require("qs");

const renderFullPage = (html, preloadedState, bundle, env) => {
  // the raw markup that the client will receive
  // notice how there is no static .html file anywhere in this repository!

  // also note how we are serializing the preloaded state to prevent XSS attacks
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>SmmKeeper</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" type="text/css" href="/dist/main.css">
    </head>

    <body>
        <div id="root">
          <div>${html}</div>
        </div>
        <div id="modalRoot"></div>
    </body>
    <script>window.INITIAL_STATE = ${serialize(preloadedState)};</script>
    ${bundle}

    </html>
  `;
};

const normalizeAssets = assets => {
  return assets.reduce((acc, chunk) => {
    if (Array.isArray(chunk)) {
      chunk.forEach(chunklet => {
        // need to drill down one level, since
        // HMR injects itself into the `main` chunk
        acc.push(chunklet);
      });
    } else {
      acc.push(chunk);
    }
    return acc;
  }, []);
};

// const concatDevBundle = assetsByChunkName => {
//   return normalizeAssets([assetsByChunkName.main])
//     .filter(path => path.endsWith(".js"))
//     .map(path => `<script src="/${path}"></script>`)
//     .join("\n");
// };

const loadRouteDependencies = (location, store, ctx) => {
  // matchRoutes from 'react-router-config' handles this nicely
  console.log(routes, location);

  const currentRoute = matchRoutes(routes, location);

  console.log(currentRoute);

  const need = currentRoute.map(({ route, match }) => {
    // once the route is matched, iterate through each component
    // looking for a `static loadData()` method
    // (you'll find these in the data-dependent `/src/views/` components)
    if (ctx.cookies.get("smmk-token")) {
      console.log("private");
      return route.private && route.private.loadData
        ? // the following will be passed into each component's `loadData` method:
          route.private.loadData(
            store,
            match,
            location,
            // query params are stored in the same place as dynamic child routes,
            // but the key will be '0'
            qs.parse(match.params["0"], { ignoreQueryPrefix: true })
          )
        : Promise.resolve(null);
    } else {
      console.log("public");
      return route.public && route.public.loadData
        ? route.public.loadData(
            store,
            match,
            location,
            qs.parse(match.params["0"], { ignoreQueryPrefix: true })
          )
        : Promise.resolve(null);
    }
    // @TODO: return 404
    Promise.resolve(null);
  });

  console.log(need);

  return Promise.all(need);
};

const handleRender = async ctx => {
  // start here

  // --> /src/store.js
  const { store, history } = configureStore({}, "fromServer");

  // once `store` is configured, dispatch the proper route into
  // the routerReducer
  console.log(ctx.url);
  store.dispatch(push(ctx.url)); // Need to find more elegant way to do this?

  // now that the route is in the redux state tree,
  // routing itself is taken care of...
  // however, in order to render the page, we need to check
  // if there are any data dependencies, and if so, load them
  try {
    const data = await loadRouteDependencies(ctx.url, store, ctx);

    console.log(data);

    // let bundle;
    // if (process.env.NODE_ENV === "development") {
    //   // in dev, it's necessary to dynamically load each asset
    //   // so that HMR works properly
    //   bundle = concatDevBundle(
    //     res.locals.webpackStats.toJson().assetsByChunkName
    //   );
    // } else {
    //   // in prod, the bundle is pre-compiled, so it's ok to serve it statically
    //   bundle = '<script src="/dist/main.js"></script>';
    // }

    let bundle = '<script src="/dist/bundle.js"></script>';

    // this is where server-side rendering actually happens!
    // however, we have a problem:
    // static routing is the only way the server can route,
    // and we need to use <ConnectedRouter> (from rrr) instead of `<StaticRouter>` (from rr v4)...
    // this is where `react-router-config` comes to the rescue (--> /routing/serverRoutes for more detail)
    const toRender = ReactDOMServer.renderToString(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>{renderRoutes(routes, { ...data })}</div>
        </ConnectedRouter>
      </Provider>
    );
    // once everything is fully rendered, get a copy of the current redux state
    // to send to the client so it can pick up where the server left off
    const preloadedState = store.getState();

    // --> /index.js
    ctx.status = 200;

    ctx.body = renderFullPage(
      toRender,
      preloadedState,
      bundle,
      process.env.NODE_ENV
    );
  } catch (e) {
    console.log(e);
  }
};

export { handleRender }; // eslint-disable-line
