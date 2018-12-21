// @flow

import React, { PureComponent } from "react";
import anime from "animejs";
import type { Props, State } from "./types";

const gradientAnimation = (el, from, to) => {
  const targets = {
    gradientChange: from
  };

  if (el) {
    anime({
      targets,
      gradientChange: to,
      duration: 200,
      easing: "linear",
      update: () => {
        const { gradientChange } = targets;

        el.style.backgroundImage = `radial-gradient(circle farthest-side at bottom left, #10cc8d ${0 +
          gradientChange}%, #5BB485 ${100 + gradientChange}%)`;
      }
    });
  }
};

// [].map.call(targetElements, el => {
//   el.onmouseenter = () => {
//     gradientAnimation(el, 0, -40);
//   };

//   el.onmouseleave = () => {
//     gradientAnimation(el, -40, 0);
//   };
// });

export default class GradientButton extends PureComponent<Props, State> {
  // The `?` here is important because you may not always have the instance.
  button: ?HTMLButtonElement;

  render() {
    const { className } = this.props;

    return (
      <button
        className={`gradientButton ${className ? className : ""}`}
        onMouseEnter={() => gradientAnimation(this.button, 0, -40)}
        onMouseLeave={() => gradientAnimation(this.button, -40, 0)}
        ref={el => (this.button = el)}
        onClick={this.props.handleClick}
      >
        {this.props.value}
      </button>
    );
  }
}
