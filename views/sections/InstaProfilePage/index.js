// @flow

import React, { Component } from "react";
import type { Props, State } from "./types";
import GradientButton from "components/GradientButton";
import { startTask, fetchTasks, updateLimit } from "ducks/inst";
import BarChart from "components/BarChart";
import RangeGradient from "components/RangeGradient";
import TaskTable from "sections/TaskTable";
import Tabs from "components/Tabs";
import { connect } from "react-redux";

class InstaProfilePage extends Component<Props, State> {
  // componentDidMount() {
  //   this.props.fetchTasks(this.props.username);
  // }

  state = {
    tabs: [
      {
        id: 1,
        value: "All profiles"
      },
      {
        id: 2,
        value: "Current"
      }
    ],
    activeTab: 1
  };

  componentDidUpdate(prevProps) {
    const token =
      typeof window !== "undefined" && localStorage.getItem("tktoken");
    // console.log("need to update", this.props.username, prevProps.username);

    if (
      this.props.username !== prevProps.username &&
      !this.props.progressFetchTasks
    ) {
      // $FlowFixMe
      this.props.fetchTasks(this.props.username, token);
    }
  }

  handleChangeTab = activeTab => this.setState({ activeTab });

  render() {
    const { username, tasksList, accList } = this.props;

    const acc = this.props.accList.find(el => el.username === username);

    function accMark(stats, mark) {
      if (stats.length > 1) {
        let x = stats[0][mark] - stats[1][mark];
        if (x >= 0) {
          return (
            <span className="profile-info__text profile-info__text_mark-green">
              +{x}
            </span>
          );
        } else {
          return (
            <span className="profile-info__text profile-info__text_mark-red">
              {x}
            </span>
          );
        }
      } else {
        return "";
      }
    }

    return (
      <div className="instaprofile">
        {/* <h1 className="instaprofile__name">@{username}</h1> */}
        <div className="container-fluid">
          <div className="row">
            {/* <div className="col-profile-info"> */}
            {acc &&
              acc.stats &&
              acc.stats.length > 0 && (
                <div className="panel profile-info">
                  <div className="profile-info__profile">
                    <span className="profile-info__profile-text">Profile</span>
                    <span className="profile-info__profile-text profile-info__profile-text_grey">
                      Paid till {`27.10.2019`}
                    </span>
                  </div>
                  <span className="profile-info__name">{username}</span>
                  <div className="profile-info__block">
                    <span className="profile-info__text">
                      {acc.stats[0].followers}
                    </span>
                    {accMark(acc.stats, "followers")}
                    <span className="profile-info__caption">Followers</span>
                  </div>
                  <div className="profile-info__block">
                    <span className="profile-info__text">
                      {acc.stats[0].follows}
                    </span>
                    {accMark(acc.stats, "follows")}
                    <span className="profile-info__caption">Following</span>
                  </div>
                  <div className="profile-info__block">
                    <span className="profile-info__text">
                      {acc.postsCount || 0}
                    </span>
                    <span className="profile-info__caption">Posts</span>
                  </div>
                </div>
              )}
            {/* </div> */}
            {/* <div className="col-limits"> */}
            {acc &&
              acc.limits &&
              acc.limits.mf &&
              acc.limits.ml && (
                <div className="panel limits">
                  <h4 className="limits__caption">Limits for actions</h4>
                  <span className="limits__text">Likes/hr. </span>
                  <RangeGradient
                    minValue={acc.limits.ml.min}
                    maxValue={acc.limits.ml.max}
                    currentValue={acc.limits.ml.current}
                    handleDragEnd={value =>
                      this.props.updateLimit(username, "ml", value)
                    }
                  />
                  <span className="limits__text limits__text_doubel">
                    <span>Follows and Unfollows/hr.</span>
                    <span className="limits__text limits__text_red">
                      Unsafe
                    </span>
                  </span>

                  <RangeGradient
                    minValue={acc.limits.mf.min}
                    maxValue={acc.limits.mf.max}
                    currentValue={acc.limits.mf.current}
                    handleDragEnd={value =>
                      this.props.updateLimit(username, "mf", value)
                    }
                  />
                </div>
              )}

            {/* </div> */}
            {/* <div className="col-stats"> */}
            <div className="panel stats">
              <div className="stats__top">
                <div className="stats__top-nav">
                  <span className="stats__top-text">Metrics</span>
                </div>
                <div className="stats__top-growth">
                  <span className="stats__top-text stats__top-text_grey">
                    Average growth: X followers / day
                  </span>
                </div>
              </div>
              <div className="stats__chart">
                <BarChart data={acc && acc.stats ? acc.stats : []} />
              </div>
            </div>
            {/* </div> */}
          </div>

          <div className="row">
            <TaskTable />
          </div>
        </div>

        {/* <GradientButton
          handleClick={() =>
            store.dispatch(startTask({ username, type: "mf" }))
          }
          value={"Start massfollowing"}
        />

        {tasksList !== null && tasksList.length ? (
          <div className="tasksTable">
            {tasksList.map(
              ({
                unteractionsNum,
                sourceUsername,
                type,
                status,
                startDate
              }) => (
                <div className="tasksTable__row">Task:</div>
              )
            )}
          </div>
        ) : (
          false
        )} */}
      </div>
    );
  }
}

export default connect(
  ({ inst: { accList, tasksList, progressFetchTasks } }) => ({
    accList,
    tasksList,
    progressFetchTasks
  }),
  dispatch => ({
    fetchTasks: (username, token) => dispatch(fetchTasks({ username, token })),
    startTask: (username, type) => dispatch(startTask({ username, type })),
    updateLimit: (username, type, limitValue) =>
      dispatch(updateLimit({ username, type, limitValue }))
  })
)(InstaProfilePage);
