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
      innerTrack.style.width = `${slider.clientWidth}px`;

      // Disable hthml5 drag and drop
      button.addEventListener("dragstart", () => false);

      // Displaying the initial value on the range slider
      const { currentValue } = this.props;
      const { minValue, maxValue } = this.state;

      if (currentValue && currentValue > minValue && currentValue < maxValue) {
        const right = slider.offsetWidth - button.offsetWidth;

        const initialLeftPersent =
          (currentValue - minValue) * (100 / (maxValue - minValue));
        const initialLeft =
          (currentValue - minValue) * (right / (maxValue - minValue));
        button.style.left = `${initialLeftPersent}%`;
        innerTrack.style.left = `-${initialLeft}px`;
      }

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
          var leftPersent = (left * 100) / slider.clientWidth;
          // console.log(e.pageX, sliderCoords.left);

          if (leftPersent < 0) {
            leftPersent = 0;
            left = 0;

            button.style.left = `${leftPersent}%`;
            innerTrack.style.left = `-${left}px`;

            if (this.state.value !== this.state.minValue) {
              this.setState({ value: this.state.minValue });
            }

            return false;
          }

          let right = slider.offsetWidth - button.offsetWidth;
          if (left > right) {
            leftPersent = 100;
            left = right;

            button.style.left = `${leftPersent - 1.8}%`;
            innerTrack.style.left = `-${left}px`;

            if (this.state.value !== this.state.maxValue) {
              this.setState({ value: this.state.maxValue });
            }

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

          button.style.left = `${leftPersent}%`;
          innerTrack.style.left = `-${left}px`;
        };

        const mouseUpHandler = () => {
          document.removeEventListener("mousemove", mouseMoveHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
          console.log("Drag finished");
          this.props.handleDragEnd(this.state.value);
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

        <div className="range__button" ref={el => (this.button = el)}>
          <div className="range__text">
            <span>{this.state.value}</span>
          </div>
          <div className="range__dot">
            <div className="range__track" ref={el => (this.innerTrack = el)} />
          </div>
        </div>
      </div>
    );
  }
}
