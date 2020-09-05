import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles/Home.module.sass";
import AuthService from "../../services/auth.service";
import ImagesListAlbum from "./ImagesListAlbum";
import ImageSlider from "./ImageSlider";
import { hideHeader, hideLogo, showLogo } from "../../actions";
import Header from "../Header";

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
  const [activeIndex, setActiveIndex] = useState(-1);

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
      <Header sticky={true} />
      <article className={styles.welcomeText}>
        <p>
          <span className={styles.subtitle}>{subtitle}</span>
          <span className={styles.bodyText}>{bodyText}</span>
        </p>
        <p className={styles.sign}>{welcomeArticle.sign}</p>
        <p className={styles.origin}>{welcomeArticle.origin}</p>
      </article>
      <div className={styles.content}>
        <p>Wyróżnione zdjęcia:</p>
        <ImagesListAlbum
          isLoading={isLoading}
          images={images}
          isHighlighted={true}
          handleImageClick={(index) => {
            setActiveIndex(index);
            setModalShow(true);
            dispatch(hideLogo());
          }}
          yearIndex={0}
        />
      </div>
      <ImageSlider
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setActiveIndex(1);
          dispatch(showLogo());
        }}
        images={images}
        activeIndex={activeIndex}
        left={[]}
        fetchData={null}
        isPreview={true}
      />
    </div>
  );
}

export default Home;
