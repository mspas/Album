import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles/Home.module.sass";
import stylesHeader from "../Header.module.sass";
import AuthService from "../../services/auth.service";
import Header from "../Header";
import HighlightedImagesList from "./HighlightedImagesList";
import ImageSlider from "./ImageSlider";

function Home() {
  const [images, setImages] = useState([]);
  const [welcomeArticle, setWelcomeArticle] = useState({
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [headerShow, setHeaderShow] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);
  const headerRef = useRef(null);

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
        setWelcomeArticle(json);
        setSubtitle(json.text.substr(0, json.text.indexOf(" ")));
        setBodyText(json.text.substr(json.text.indexOf(" ") + 1));
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

  const handleImageClick = (index) => {
    setActiveIndex(index);
    setModalShow(true);
    setHeaderShow(false);
    headerRef.current.style.zIndex = 0;
    headerRef.current.style.visibility = "hidden";
  };

  return (
    <div className={styles.homePage}>
      <Header showBtns={false} showLogo={true} show={headerShow} />
      <div className={styles.welcomePanel} ref={containerRef}>
        <div className={styles.welcomeContent}>
          <p className={styles.subtitle}>
            <span>Miejsca</span>
            <span>Ludzie</span>
            <span>Wspomnienia</span>
          </p>
        </div>
      </div>
      <header ref={headerRef} className={styles.header}>
        <span className={styles.cityTitle}>Paradyż</span>
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
      <article className={styles.welcomeText}>
        <p>
          <span className={styles.subtitle}>{subtitle}</span>
          <span className={styles.bodyText}>{bodyText}</span>
        </p>
        <p className={styles.sign}>{welcomeArticle.sign}</p>
        <p className={styles.origin}>{welcomeArticle.origin}</p>
      </article>
      <div className={styles.content}>
        <HighlightedImagesList
          isLoading={isLoading}
          welcomeArticle={welcomeArticle}
          images={images}
          onImageClick={handleImageClick}
        />
      </div>
      <ImageSlider
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setHeaderShow(true);
          setActiveIndex(1);
          headerRef.current.style.zIndex = 3;
          headerRef.current.style.visibility = "visible";
        }}
        images={images}
        activeIndex={activeIndex}
      />
    </div>
  );
}

export default Home;
