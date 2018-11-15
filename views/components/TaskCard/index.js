// @flow

import React from "react";
import type { Props } from "./types";
import Tick from "icons/Tick";
import Play from "icons/Play";
import { completeToDo, incompleteToDo } from "ducks/todolist";
import store from "store";

const TaskCard = ({ todo, done }: Props) => (
  <div className="taskCard">
    <span
      className={done ? "taskCard__tick taskCard__tick_done" : "taskCard__tick"}
      onClick={
        done
          ? () => store.dispatch(incompleteToDo(todo))
          : () => store.dispatch(completeToDo(todo))
      }
    >
      <Tick checked={done || todo.done} />
    </span>
    <span className="taskCard__name">{todo.name}</span>
    <span className="taskCard__timer">
      <Play />
    </span>
  </div>
);

export default TaskCard;
