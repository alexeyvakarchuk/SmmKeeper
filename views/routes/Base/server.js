/*
  serverRoutes.js
  Used instead of <Route> in `react-router-config` on the server.
  Compatible with `react-router-redux`'s `<ConnectedRouter>`
*/

import BaseApp from "views/BaseApp";

import PrivateRoute from "components/PrivateRoute";
import PublicRoute from "components/PublicRoute";
import HomePage from "pages/HomePage";
import Auth from "pages/Auth";
import Internal from "pages/Internal";
import NoMatch from "pages/NoMatch";
import AuthSuccess from "pages/AuthSuccess";

// Fairly straightforward object nesting, should mirror `<BaseRoute>`
// structure in /src/routing/BaseRoutes.js
const routes = [
  {
    component: BaseApp,
    routes: [
      {
        path: "/",
        exact: true,
        public: HomePage,
        private: Internal
      },
      {
        path: "/sign-in",
        public: Auth,
        private: Internal
      },
      {
        path: "/sign-up",
        public: Auth,
        private: Internal
      },
      {
        path: "/app/:id",
        private: Internal
      }
      // {
      //   path: "/auth/success",
      //   component: "pages/AuthSuccess"
      // },
      // {
      //   // For query params, need a wildcard after base route
      //   // @TODO: Sanitization?
      //   path: "/dataDepsParams(.*)?",
      //   component: StaticDataDepsParams
      // },
      // {
      //   path: "/dynamic/:id",
      //   component: DynamicPage
      // }
    ]
  }
];

export default routes;
