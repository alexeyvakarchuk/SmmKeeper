// @flow

import React, { PureComponent } from "react";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import type { Props, State } from "./types";
import Chart from "chart.js";
import moment from "moment";

class BarChart extends PureComponent<Props, State> {
  state = {
    filter: null
  };

  lineChart = {};

  componentDidMount() {
    const { data } = this.props;
    const ctx = document.querySelector(".stats canvas");

    this.lineChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map(el => moment(el.date).format("D")).reverse(),
        datasets: [
          {
            data: data.map(el => el.followers).reverse(),
            backgroundColor: "#0870BF",
            hoverBackgroundColor: "#078CF2",
            borderWidth: 0
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              // ticks: {
              //   beginAtZero: true,
              //   fixedStepSize: 5,
              //   max: 15,
              //   min: 0
              // },
              ticks: {
                display: false
              },
              gridLines: {
                drawBorder: false,
                color: "#F5F7F7"
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontColor: "#DEE6E9"
              },
              gridLines: {
                display: false
              },
              // barPercentage: 1.0,
              // categoryPercentage: 0.2
              maxBarThickness: 20
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
        // barPercentage: 0.5,
        // categoryPercentage: 0.3
      }
    });
  }

  // handleDatesChange = ({
  //   startDate,
  //   endDate
  // }: {
  //   startDate: Object,
  //   endDate: Object
  // }) => {
  //   this.setState({ startDate, endDate });

  //   if (startDate && endDate) {
  //     let data = [];

  //     const start = startDate.clone().startOf("day");
  //     const end = endDate.clone().endOf("day");

  //     const diff = end.diff(start, "days");

  //     data.push({
  //       label: start.format("DD.MM"),
  //       value: Math.random() * 12
  //     });

  //     for (let i = 1; i <= diff; i++) {
  //       // console.log(start.add(1, "d"));
  //       data.push({
  //         label: start.add(1, "d").format("DD.MM"),
  //         value: Math.random() * 12
  //       });
  //     }

  //     this.setState({ data });
  //   }
  // };

  componentDidUpdate(prevProps: Props) {
    if (this.props.data !== prevProps.data) {
      this.lineChart.data.labels = this.props.data
        .map(el => moment(el.date).format("D"))
        .reverse();
      this.lineChart.data.datasets[0].data = this.props.data
        .map(el => el.followers)
        .reverse();
      this.lineChart.update();
    }
  }

  render() {
    return <canvas />;
  }
}

export default BarChart;
