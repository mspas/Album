import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles/Album.module.sass";
import { showHeader } from "../../actions";

function Album() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showHeader());
  }, []);

  return <div className={styles.welcomeWrap}>siema</div>;
}

export default Album;
