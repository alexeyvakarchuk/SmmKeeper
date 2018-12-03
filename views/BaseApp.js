import React, { Component } from "react";
import BaseRoutes from "routes/Base/client";
import { withRouter } from "react-router-dom";

class BaseApp extends Component {
  render() {
    return (
      <BaseRoutes location={this.props.location} store={this.props.store} />
    );
  }
}

export default withRouter(BaseApp);
