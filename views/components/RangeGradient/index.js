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

      // console.log("Updated via user", this.props.currentValue);

      if (
        currentValue &&
        currentValue >= minValue &&
        currentValue <= maxValue
      ) {
        const right = slider.offsetWidth - button.offsetWidth;

        const initialLeftPersent =
          (currentValue - minValue) * (100 / (maxValue - minValue));
        const initialLeft =
          (currentValue - minValue) * (right / (maxValue - minValue));

        button.style.left =
          currentValue === maxValue
            ? `calc(${initialLeftPersent}% - ${button.offsetWidth}px)`
            : `${initialLeftPersent}%`;

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
        if (innerTrack.style.width != `${slider.clientWidth}px`) {
          innerTrack.style.width = `${slider.clientWidth}px`;
        }
        const buttonCoords = getCoords(button);

        const shiftX = e.pageX - buttonCoords.left;
        const sliderCoords = getCoords(slider);

        const mouseMoveHandler = (e: Object) => {
          let left = e.pageX - shiftX - sliderCoords.left;
          var leftPersent = (left * 100) / slider.clientWidth;

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

            button.style.left = `calc(${leftPersent}% - ${
              button.offsetWidth
            }px)`;
            innerTrack.style.left = `-${left}px`;

            if (this.state.value !== this.state.maxValue) {
              this.setState({ value: this.state.maxValue });
            }

            return false;
          }

          // if (e.pageX > sliderCoords.left) {
          const { maxValue, minValue } = this.state;

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

  componentDidUpdate(prevProps: Props) {
    const { currentValue } = this.props;

    if (currentValue !== prevProps.currentValue) {
      const { slider, button, innerTrack } = this;

      if (slider && button && innerTrack) {
        // Displaying the initial value on the range slider
        const { minValue, maxValue } = this.state;

        // console.log("Updated via socket", this.props.currentValue);

        if (
          currentValue &&
          currentValue >= minValue &&
          currentValue <= maxValue
        ) {
          const right = slider.offsetWidth - button.offsetWidth;

          const initialLeftPersent =
            (currentValue - minValue) * (100 / (maxValue - minValue));
          const initialLeft =
            (currentValue - minValue) * (right / (maxValue - minValue));

          button.style.left =
            currentValue === maxValue
              ? `calc(${initialLeftPersent}% - ${button.offsetWidth}px)`
              : `${initialLeftPersent}%`;

          innerTrack.style.left = `-${initialLeft}px`;

          this.setState({ value: currentValue });
        }
      }
    }
  }

  // shouldComponentUpdate(nextProps: Props, nextState: State) {
  //   if (this.props.currentValue !== nextProps.currentValue) {
  //     console.log("aaa", this.props.currentValue, nextProps.currentValue);
  //     return true;
  //   }

  //   return false;
  // }

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
