import React, { Component } from "react";
import routes, { Link } from "server/routes";
import { withRouter } from "next/router";

class NavLink extends Component {
  static defaultProps = {
    activeClassName: "active"
  };

  render() {
    const {
      className,
      activeClassName,
      children,
      router,
      ...props
    } = this.props;

    const isActiveRoute =
      props.route === undefined
        ? false
        : routes.findAndGetUrls(props.route, props.params).urls.as ===
          router.asPath;

    return (
      <Link {...props}>
        <a className={`${className} ${isActiveRoute ? activeClassName : ""}`}>
          {children}
        </a>
      </Link>
    );
  }
}

export default withRouter(NavLink);
