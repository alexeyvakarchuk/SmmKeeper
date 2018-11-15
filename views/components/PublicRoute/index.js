// import React, { Component } from "react";
// import { Route, Redirect } from "react-router-dom";
// import type { State, Props } from "./types";
// import { fetchUserAuth } from "utils";

// class PublicRoute extends Component<Props, State> {
//   state = {
//     loading: false,
//     auth: false
//   };

//   async componentDidMount() {
//     const auth = await fetchUserAuth();

//     console.log(auth);

//     this.setState({ loading: false, auth });
//   }

//   render() {
//     const { render, ...rest } = this.props;

//     return this.state.loading ? (
//       <Route
//         render={() =>
//           this.state.auth ? (
//             <Redirect
//               to={{
//                 pathname: "/app",
//                 state: { from: this.props.location }
//               }}
//             />
//           ) : (
//             render()
//           )
//         }
//       />
//     ) : (
//       <div>false</div>
//     );
//   }
// }

// export default PublicRoute;

// @flow

import React, { PureComponent } from "react";
import { Route, Redirect } from "react-router-dom";
import type { State, Props } from "./types";
import { fetchUserAuth } from "utils";

class PublicRoute extends PureComponent<Props, State> {
  state = {
    loading: true,
    auth: false
  };

  async componentDidMount() {
    // const checkUserAuth = () => {
    //   return new Promise((resolve, reject) => {
    //     fetchUserAuth()
    //       .then(auth => {
    //         console.log(auth);
    //         this.setState({ loading: false, auth });
    //       })
    //       .catch(e => {
    //         console.log(e);
    //       });
    //   });
    // };
    try {
      const auth = await fetchUserAuth();

      this.setState({ loading: false, auth });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { render, ...rest } = this.props;

    return !this.state.loading ? (
      <Route
        render={() =>
          this.state.auth ? (
            <Redirect
              to={{
                pathname: "/app",
                state: { from: this.props.location }
              }}
            />
          ) : (
            render()
          )
        }
      />
    ) : (
      false
    );
  }
}

export default PublicRoute;
