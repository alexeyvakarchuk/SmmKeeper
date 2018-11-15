import { combineReducers } from "redux";
import authReducer, { moduleName as authModule } from "ducks/auth";
import todoReducer, { moduleName as todoModule } from "ducks/todolist";
import socketReducer, { moduleName as socketModule } from "ducks/socket";
import routerReducer, { moduleName as routerModule } from "ducks/router";
import passwordReducer, { moduleName as passwordModule } from "ducks/password";

export default combineReducers({
  [authModule]: authReducer,
  [todoModule]: todoReducer,
  [socketModule]: socketReducer,
  [routerModule]: routerReducer,
  [passwordModule]: passwordReducer
});
