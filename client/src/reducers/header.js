const headerReducer = (state = true, action) => {
  switch (action.type) {
    case "SHOW_HEADER":
      return true;
    case "HIDE_HEADER":
      return false;
    default:
      return state;
  }
};
export default headerReducer;
