import headerReducer from "./header";
import logoReducer from "./logo";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  showHeader: headerReducer,
  showLogo: logoReducer,
});
export default rootReducer;
