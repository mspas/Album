import React, { useEffect, useRef } from "react";
import styles from "./styles/Album.module.sass";
import logo from "../../assets/logo.png";

function Album() {
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const containerRef = useRef(null);

  const handleScroll = (event) => {
    let startingPos = 15;
    let value = window.scrollY;
    let elementText = containerRef.current;

    let bgPos = `0% ${startingPos + value * -0.1}%`;
    elementText.style.backgroundPosition = bgPos;
  };

  return (
    <div className={styles.welcomeWrap}>
      <div className={styles.welcomePanel} ref={containerRef}>
        <div className={styles.headerContent}>
          <p className={styles.subtitle}>
            <span>Miejsca</span>
            <span>Ludzie</span>
            <span>Wspomnienia</span>
          </p>
        </div>
      </div>
      <header className={styles.header}>
        <img src={logo} alt="Logo" />
      </header>
      <div className={styles.content}></div>
    </div>
  );
}

export default Album;
