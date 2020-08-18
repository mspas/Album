const logoReducer = (state = true, action) => {
  switch (action.type) {
    case "SHOW_LOGO":
      return true;
    case "HIDE_LOGO":
      return false;
    default:
      return state;
  }
};
export default logoReducer;
