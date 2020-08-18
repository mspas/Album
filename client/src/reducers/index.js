import headerReducer from "./header";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  showHeader: headerReducer,
});
export default rootReducer;
