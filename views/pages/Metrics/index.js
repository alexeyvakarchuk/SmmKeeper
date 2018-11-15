// @flow

import React, { PureComponent } from "react";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import type { Props, State } from "./types";
import Chart from "chart.js";

class Metrics extends PureComponent<Props, State> {
  state = {
    startDate: null,
    endDate: null,
    focusedInput: null,
    data: []
  };

  lineChart = {};

  componentDidMount() {
    const { data } = this.state;
    const ctx = document.querySelector(".lineChart canvas");

    this.lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.state.data.map(el => el.label),
        datasets: [
          {
            data: this.state.data.map(el => el.value),
            backgroundColor: "rgba(16,204,141,.2)",
            borderColor: "rgba(16,204,141,1)",
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      }
    });
  }

  handleDatesChange = ({
    startDate,
    endDate
  }: {
    startDate: Object,
    endDate: Object
  }) => {
    this.setState({ startDate, endDate });

    if (startDate && endDate) {
      let data = [];

      const start = startDate.clone().startOf("day");
      const end = endDate.clone().endOf("day");

      const diff = end.diff(start, "days");

      data.push({
        label: start.format("DD.MM"),
        value: Math.random() * 12
      });

      for (let i = 1; i <= diff; i++) {
        // console.log(start.add(1, "d"));
        data.push({
          label: start.add(1, "d").format("DD.MM"),
          value: Math.random() * 12
        });
      }

      this.setState({ data });
    }
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.data !== prevState.data) {
      this.lineChart.data.labels = this.state.data.map(el => el.label);

      this.lineChart.data.datasets[0].data = this.state.data.map(
        el => el.value
      );

      this.lineChart.update();
    }
  }

  render() {
    return (
      <section className="metrics">
        <div className="container">
          <h3>Metrics</h3>

          <DateRangePicker
            startDate={this.state.startDate} // momentPropTypes.momentObj or null,
            startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
            endDate={this.state.endDate} // momentPropTypes.momentObj or null,
            endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
            onDatesChange={this.handleDatesChange} // PropTypes.func.isRequired,
            isOutsideRange={() => false}
            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          />

          <div className="lineChart">
            <canvas />
          </div>
        </div>
      </section>
    );
  }
}

export default Metrics;
