import React from "react";
import styles from "./styles/Album.module.sass";
import logo from "../../assets/logo-text.png";

function Album() {
  return (
    <div>
      <div className={styles.logoWrap}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.welcomePanel}>
        <div className={styles.headerContent}>
          <h1>Paradyż</h1>
          <p className={styles.subtitle}>
            <span>ludzie</span>
            <span>miejsca</span>
            <span>wspomnienia</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Album;
