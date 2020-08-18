import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import styles from "./styles/Home.module.sass";
import stylesHeader from "../Header.module.sass";
import AuthService from "../../services/auth.service";
import HighlightedImagesList from "./HighlightedImagesList";
import ImageSlider from "./ImageSlider";
import { hideHeader, showHeader, hideLogo, showLogo } from "../../actions";

function Home() {
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [welcomeArticle, setWelcomeArticle] = useState({
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const headerRef = useRef(null);

  useEffect(() => {
    fetchData();
    dispatch(hideHeader());
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

  return (
    <div className={styles.homePage}>
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
          handleImageClick={(index) => {
            setActiveIndex(index);
            setModalShow(true);
            dispatch(hideLogo());
            headerRef.current.style.zIndex = 0;
            headerRef.current.style.visibility = "hidden";
          }}
        />
      </div>
      <ImageSlider
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setActiveIndex(1);
          dispatch(showLogo());
          headerRef.current.style.zIndex = 2;
          headerRef.current.style.visibility = "visible";
        }}
        images={images}
        activeIndex={activeIndex}
      />
    </div>
  );
}

export default Home;
