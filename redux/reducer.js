import { combineReducers } from "redux";
import authReducer, { moduleName as authModule } from "ducks/auth";
import instReducer, { moduleName as instModule } from "ducks/inst";
import socketReducer, { moduleName as socketModule } from "ducks/socket";
import passwordReducer, { moduleName as passwordModule } from "ducks/password";
import connectAccPopupReducer, {
  moduleName as connectAccPopupModule
} from "ducks/connectAccPopup";
import startTaskPopupReducer, {
  moduleName as startTaskPopupModule
} from "ducks/startTaskPopup";

export default combineReducers({
  [authModule]: authReducer,
  [instModule]: instReducer,
  [socketModule]: socketReducer,
  [passwordModule]: passwordReducer,
  [connectAccPopupModule]: connectAccPopupReducer,
  [startTaskPopupModule]: startTaskPopupReducer
});
