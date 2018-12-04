// @flow

import React, { PureComponent } from "react";
import type { Props, State } from "./types";
import GradientButton from "components/GradientButton";
import { startTask, fetchTasks } from "ducks/inst";
import { connect } from "react-redux";
import store from "store";

class InstaProfilePage extends PureComponent<Props, State> {
  componentDidMount() {
    store.dispatch(fetchTasks({ username: this.props.username }));
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      store.dispatch(fetchTasks({ username: this.props.username }));
    }
  }

  render() {
    const { username, tasksList, accList } = this.props;

    const acc = this.props.accList.find(el => el.username === username);

    return (
      <div className="instaprofile">
        {/* <h1 className="instaprofile__name">@{username}</h1> */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-md-3">
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
                  <span className="profile-info__text profile-info__text_mark">
                    {acc.stats.length > 1
                      ? acc.stats[0].followers - acc.stats[1].followers
                      : ""}
                  </span>
                  <span className="profile-info__caption">Followers</span>
                </div>
                <div className="profile-info__block">
                  <span className="profile-info__text">
                    {acc.stats[0].follows}
                  </span>
                  <span className="profile-info__text profile-info__text_mark">
                    {acc.stats.length > 1
                      ? acc.stats[0].follows - acc.stats[1].follows
                      : ""}
                  </span>
                  <span className="profile-info__caption">Following</span>
                </div>
                <div className="profile-info__block">
                  <span className="profile-info__text">{65}</span>
                  <span className="profile-info__caption">Posts</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-3">
              <div className="panel" />
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="panel" />
            </div>
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

export default connect(({ inst: { accList, tasksList } }) => ({
  accList,
  tasksList
}))(InstaProfilePage);
