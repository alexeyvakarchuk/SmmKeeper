// @flow

import * as React from "react";
import type { Props, State } from "./types";

export default class RangeGradient extends React.PureComponent<Props, State> {
  // The `?` here is important because you may not always have the instance.
  slider: ?HTMLDivElement;
  button: ?HTMLDivElement;
  innerTrack: ?HTMLDivElement;

  state = {
    minValue: this.props.minValue,
    maxValue: this.props.maxValue,
    value: this.props.currentValue || this.props.minValue
  };

  componentDidMount() {
    const { slider, button, innerTrack } = this;

    if (slider && button && innerTrack) {
      if (
        this.props.currentValue &&
        this.props.currentValue < this.state.maxValue &&
        this.props.currentValue > this.state.minValue
      ) {
      }

      innerTrack.style.width = `${slider.clientWidth}px`;

      // Disable hthml5 drag and drop
      button.addEventListener("dragstart", () => false);

      const getCoords = (elem: HTMLDivElement) => {
        const { top, left } = elem.getBoundingClientRect();

        return {
          top,
          left
        };
      };

      button.onmousedown = (e: Object) => {
        const buttonCoords = getCoords(button);

        const shiftX = e.pageX - buttonCoords.left;
        const sliderCoords = getCoords(slider);
        console.log("Drag started");

        const mouseMoveHandler = (e: Object) => {
          let left = e.pageX - shiftX - sliderCoords.left;

          // console.log(e.pageX, sliderCoords.left);

          if (left < 0) {
            left = 0;

            button.style.left = `${left}px`;
            innerTrack.style.left = `-${left}px`;
            this.setState({ value: this.state.minValue });

            return false;
          }

          let right = slider.offsetWidth - button.offsetWidth;

          if (left > right) {
            left = right;

            button.style.left = `${left}px`;
            innerTrack.style.left = `-${left}px`;
            this.setState({ value: this.state.maxValue });

            return false;
          }

          // if (e.pageX > sliderCoords.left) {
          const { maxValue, minValue } = this.state;

          console.log(left, right);

          const currentValue = Math.round(
            minValue + (left * (maxValue - minValue)) / right
          );

          if (this.state.value !== currentValue) {
            this.setState({ value: currentValue });
          }

          button.style.left = `${left}px`;
          innerTrack.style.left = `-${left}px`;
        };

        const mouseUpHandler = () => {
          document.removeEventListener("mousemove", mouseMoveHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
          console.log("Drag finished");
        };

        if (document) {
          document.addEventListener("mousemove", mouseMoveHandler);
          document.addEventListener("mouseup", mouseUpHandler);
        }

        return false;
      };
    }
  }

  render() {
    return (
      <div className="range" ref={el => (this.slider = el)}>
        {/* <div class="track_2">
          <div class="range__text">0</div>
        </div> */}
        <div>{this.state.value}</div>
        <div className="range__button" ref={el => (this.button = el)}>
          <div className="track" ref={el => (this.innerTrack = el)} />
        </div>
      </div>
    );
  }
}
