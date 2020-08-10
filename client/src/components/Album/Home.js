import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles/Home.module.sass";
import stylesHeader from "../Header.module.sass";
import Header from "../Header";

function Home() {
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const containerRef = useRef(null);

  const handleScroll = (event) => {
    let startingPos = 15;
    let value = window.scrollY;
    let bgPos = `0% ${startingPos + value * -0.1}%`;

    if (containerRef.current) {
      let element = containerRef.current;
      element.style.backgroundPosition = bgPos;
    }
  };

  return (
    <div className={styles.homePage}>
      <Header showBtns={false} showLogo={true} />
      <span className={styles.cityTitle}>Paradyż</span>
      <div className={styles.welcomePanel} ref={containerRef}>
        <div className={styles.headerContent}>
          <p className={styles.subtitle}>
            <span>Miejsca</span>
            <span>Ludzie</span>
            <span>Wspomnienia</span>
          </p>
        </div>
      </div>
      <header>
        <ul>
          <li>
            <NavLink className={stylesHeader.link} to="/album">
              <span>Przglądaj album</span>
            </NavLink>
          </li>
          <li>
            <NavLink className={stylesHeader.link} to="/kontakt">
              <span>Prześlij zdjęcia</span>
            </NavLink>
          </li>
        </ul>
      </header>
      <div className={styles.content}></div>
    </div>
  );
}

export default Home;
