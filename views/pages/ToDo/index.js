// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import ToDoInput from "components/ToDoInput";
import TaskCard from "components/TaskCard";
import type { Props, State } from "./types";

class ToDo extends Component<Props, State> {
  state = {
    showCompleted: false
  };

  toggleCompletedTodosVisibility = () => {
    this.setState({ showCompleted: !this.state.showCompleted });
  };

  render() {
    const { todolist } = this.props;

    return (
      <section className="todo">
        <ToDoInput />
        {todolist.filter(el => !el.done).map(el => (
          <TaskCard todo={el} />
        ))}
        {todolist.filter(el => el.done).length > 0 && (
          <div onClick={this.toggleCompletedTodosVisibility}>
            <span className="todo__toggle-button">Toggle completed</span>
          </div>
        )}
        {this.state.showCompleted &&
          todolist
            .filter(el => el.done)
            .map(el => <TaskCard todo={el} done={true} />)}
      </section>
    );
  }
}

export default connect(({ todolist: { todolist } }) => ({ todolist }))(ToDo);
