import { combineReducers } from "redux";
import authReducer, { moduleName as authModule } from "ducks/auth";
import instReducer from "ducks/inst";
import { moduleName as instModule } from "ducks/inst/const";
import socketReducer, { moduleName as socketModule } from "ducks/socket";
import passwordReducer, { moduleName as passwordModule } from "ducks/password";
import connectAccPopupReducer, {
  moduleName as connectAccPopupModule
} from "ducks/connectAccPopup";
import createTaskPopupReducer, {
  moduleName as createTaskPopupModule
} from "ducks/createTaskPopup";

export default combineReducers({
  [authModule]: authReducer,
  [instModule]: instReducer,
  [socketModule]: socketReducer,
  [passwordModule]: passwordReducer,
  [connectAccPopupModule]: connectAccPopupReducer,
  [createTaskPopupModule]: createTaskPopupReducer
});
