import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles/Home.module.sass";
import stylesHeader from "../Header.module.sass";
import AuthService from "../../services/auth.service";
import Header from "../Header";
import HighlightedImagesList from "./HighlightedImagesList";

function Home() {
  const [images, setImages] = useState([]);
  const [welcomeArticle, setWelcomeArticle] = useState({
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const containerRef = useRef(null);

  const fetchData = () => {
    const _auth = new AuthService();
    setIsLoading(true);

    _auth
      .fetch("/api/get-welcome-article", {
        method: "GET",
      })
      .then((json) => {
        console.log(json);
        setWelcomeArticle(json);
      });

    _auth
      .fetch("/api/get-highlighted-images", {
        method: "GET",
      })
      .then((json) => {
        setImages(json);
        setIsLoading(false);
      });
  };

  const handleScroll = (event) => {
    let startingPos = 0;
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
      <header className={styles.header}>
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
      <div className={styles.content}>
        <HighlightedImagesList
          isLoading={isLoading}
          welcomeArticle={welcomeArticle}
          images={images}
        />
      </div>
    </div>
  );
}

export default Home;
