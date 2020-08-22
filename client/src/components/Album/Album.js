import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles/Album.module.sass";
import { showHeader, hideHeader, showLogo, hideLogo } from "../../actions";
import AuthService from "../../services/auth.service";
import AlbumCategorizedList from "./AlbumCategorizedList";
import ImageSlider from "./ImageSlider";

function Album() {
  const YEARS = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990];
  const LIMIT = 15;

  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [imagesResults, setImagesResults] = useState([]);
  const [yearsLeftForNextPage, setYearsLeftForNextPage] = useState([]);
  const [selectedYears, setSelectedYears] = useState(YEARS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    dispatch(showHeader());
    dispatch(showLogo());
    fetchData(selectedYears);
  }, []);

  const fetchData = (years) => {
    const _auth = new AuthService();
    setIsLoading(true);
    _auth
      .fetch("/api/get-images", {
        method: "POST",
        body: JSON.stringify({
          years: years,
          limit: LIMIT,
        }),
      })
      .then((json) => {
        console.log(JSON.stringify(json.left));
        let currentResults = [...imagesResults];
        setImagesResults(currentResults.concat(json.results));

        let currentImages = [...images];
        for (let i = 0; i < json.results.length; i++) {
          const element = json.results[i];
          console.log(json.left, json.results.length);
          currentImages = currentImages.concat(element.results);
        }
        setImages(currentImages);

        setYearsLeftForNextPage(json.left);
        setIsLoading(false);
      });
  };

  const handleImageClick = (index) => {
    console.log(index);
    setActiveIndex(index);
    setModalShow(true);
    dispatch(hideLogo());
    dispatch(hideHeader());
  };
  const handleHideClick = () => {
    setModalShow(false);
    setActiveIndex(1);
    dispatch(showLogo());
    dispatch(showHeader());
  };

  return (
    <div className={styles.albumContainer}>
      <div className={styles.filters}>
        <p>Wybierz lata:</p>
        {!modalShow && (
          <div className={styles.yearsList}>
            {YEARS.map((year, index) => {
              return (
                <div key={index} className={styles.year}>
                  <span className={styles.dunno}>
                    <span>{year}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AlbumCategorizedList
        imagesResults={imagesResults}
        left={yearsLeftForNextPage}
        handleImageClick={handleImageClick}
        isLoading={isLoading}
        fetchData={fetchData}
      />
      <ImageSlider
        show={modalShow}
        onHide={handleHideClick}
        images={images}
        activeIndex={activeIndex}
      />
    </div>
  );
}

export default Album;
