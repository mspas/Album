import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles/Album.module.sass";
import { showHeader, hideHeader, showLogo, hideLogo } from "../../actions";
import AuthService from "../../services/auth.service";
import ImagesListAlbum from "./ImagesListAlbum";
import ImageSlider from "./ImageSlider";

function Album() {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetchData();
    dispatch(showHeader());
    dispatch(showLogo());
    let value = 1890;
    let a = [];
    for (let i = 0; i < 10; i++) {
      value += 10;
      a.push(value);
    }
    setYears(a);
  }, []);

  const fetchData = () => {
    const _auth = new AuthService();
    setIsLoading(true);
    _auth
      .fetch("/api/get-all-images", {
        method: "GET",
      })
      .then((json) => {
        setImages(json);
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.albumContainer}>
      <div className={styles.filters}>
        <p>Wybierz lata:</p>
        <div className={styles.yearsList}>
          {years.map((year, index) => {
            return (
              <div key={index} className={styles.year}>
                <span className={styles.dunno}>
                  <span>{year}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.content}>
        <ImagesListAlbum
          isLoading={isLoading}
          welcomeArticle={null}
          images={images}
          handleImageClick={(index) => {
            setActiveIndex(index);
            setModalShow(true);
            dispatch(hideLogo());
            dispatch(hideHeader());
          }}
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
      />
    </div>
  );
}

export default Album;
