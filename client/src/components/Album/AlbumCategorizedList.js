import React, { useRef, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import styles from "./styles/Album.module.sass";
import ImagesListAlbum from "./ImagesListAlbum";

function AlbumCategoriesList({
  isLoading,
  left,
  imagesResults,
  handleImageClick,
  isLoadingNewSet,
  fetchData,
}) {
  const observer = useRef(null);
  const lastYearElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && left.length > 0) {
          fetchData(left, true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, left]
  );

  const onImageClick = (index, yearIndex) => {
    let count = index;
    for (let i = 0; i < yearIndex; i++) {
      const element = imagesResults[i];
      count += element.results.length;
    }
    handleImageClick(count);
  };

  return (
    <div className={styles.content}>
      {isLoadingNewSet && (
        <div className={styles.spinner}>
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
      {imagesResults.map((yearSet, index) => {
        if (yearSet.results.length > 0) {
          if (imagesResults.length === index + 1) {
            return (
              <div key={index} ref={lastYearElementRef}>
                <p className={styles.yearTitle}>{yearSet.year}</p>
                <ImagesListAlbum
                  isLoading={false}
                  images={yearSet.results}
                  isHighlighted={false}
                  handleImageClick={onImageClick}
                  yearIndex={index}
                />
              </div>
            );
          } else
            return (
              <div key={index}>
                <p className={styles.yearTitle}>{yearSet.year}</p>
                <ImagesListAlbum
                  isLoading={false}
                  images={yearSet.results}
                  isHighlighted={false}
                  handleImageClick={onImageClick}
                  yearIndex={index}
                />
              </div>
            );
        }
      })}
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
    </div>
  );
}
export default AlbumCategoriesList;
