import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles/Album.module.sass";
import { showHeader, showLogo } from "../../actions";

function Album() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showHeader());
    dispatch(showLogo());
  }, []);

  return <div className={styles.welcomeWrap}>siema</div>;
}

export default Album;
