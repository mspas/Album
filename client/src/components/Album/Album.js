import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles/Album.module.sass";
import { showHeader, hideHeader, showLogo, hideLogo } from "../../actions";
import AuthService from "../../services/auth.service";
import AlbumCategorizedList from "./AlbumCategorizedList";
import ImageSlider from "./ImageSlider";

function Album() {
  const YEARS = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990];
  const LIMIT = 10;

  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [imagesResults, setImagesResults] = useState([]);
  const [yearsLeftForNextPage, setYearsLeftForNextPage] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNewSet, setIsLoadingNewSet] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    dispatch(showHeader());
    dispatch(showLogo());
    fetchData(YEARS, false);
    defaultSelection();
  }, []);

  const defaultSelection = () => {
    let a = [];
    for (let i = 0; i < YEARS.length; i++) {
      a.push(false);
    }
    setSelectedYears(a);
  };

  const fetchData = (years, nextPage) => {
    const _auth = new AuthService();
    if (nextPage) setIsLoading(true);
    setIsLoadingNewSet(true);

    _auth
      .fetch("/api/get-images", {
        method: "POST",
        body: JSON.stringify({
          years: years,
          limit: LIMIT,
        }),
      })
      .then((json) => {
        let currentResults = [];
        let currentImages = [];

        if (nextPage) {
          currentResults = [...imagesResults];
          currentImages = [...images];
          setIsLoading(false);
        }

        setImagesResults(currentResults.concat(json.results));

        for (let i = 0; i < json.results.length; i++) {
          const element = json.results[i];
          currentImages = currentImages.concat(element.results);
        }
        setImages(currentImages);

        setYearsLeftForNextPage(json.left);
        setIsLoadingNewSet(false);
      });
  };

  const handleImageClick = (index) => {
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

  const selectYear = (index) => {
    let a = [...selectedYears];
    a[index] = !a[index];
    setSelectedYears(a);
  };

  const getImages = () => {
    let a = [];
    for (let i = 0; i < selectedYears.length; i++)
      if (selectedYears[i]) a.push(YEARS[i]);
    fetchData(a, false);
  };

  const getAllImages = () => {
    defaultSelection();
    fetchData(YEARS, false);
  };

  return (
    <div className={styles.albumContainer}>
      <div className={styles.filtersContainer}>
        <div className={styles.filters}>
          <p>Wybierz lata:</p>
          {!modalShow && (
            <div className={styles.yearsList}>
              {YEARS.map((year, index) => {
                return (
                  <div key={index} className={styles.yearBox}>
                    <span
                      className={
                        selectedYears[index]
                          ? `${styles.year} ${styles.selected}`
                          : styles.year
                      }
                      onClick={() => selectYear(index)}
                    >
                      <span>{year}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <div className={styles.btns}>
            <button
              className={`${styles.btnAlbum} button`}
              onClick={getAllImages}
            >
              Pokaż wszystkie
            </button>
            <button className={`${styles.btnAlbum} button`} onClick={getImages}>
              Zastosuj
            </button>
          </div>
        </div>
      </div>
      <AlbumCategorizedList
        imagesResults={imagesResults}
        left={yearsLeftForNextPage}
        handleImageClick={handleImageClick}
        isLoading={isLoading}
        isLoadingNewSet={isLoadingNewSet}
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
