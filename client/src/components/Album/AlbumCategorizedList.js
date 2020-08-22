import React, { useRef, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import styles from "./styles/Album.module.sass";
import ImagesListAlbum from "./ImagesListAlbum";

function AlbumCategoriesList(props) {
  const observer = useRef(null);
  const lastYearElementRef = useCallback(
    (node) => {
      if (props.isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && props.left.length > 0) {
          props.fetchData(props.left);
        }
      });
      if (node) observer.current.observe(node);
    },
    [props.isLoading, props.left]
  );

  const handleImageClick = (index, yearIndex) => {
    let count = index;
    for (let i = 0; i < yearIndex; i++) {
      const element = props.imagesResults[i];
      count += element.results.length;
      console.log("count", count);
    }
    console.log(count);
    props.handleImageClick(count);
  };

  return (
    <div className={styles.content}>
      {props.imagesResults.map((yearSet, index) => {
        if (yearSet.results.length > 0) {
          if (props.imagesResults.length === index + 1) {
            return (
              <div key={index} ref={lastYearElementRef}>
                <p>{yearSet.year}</p>
                <ImagesListAlbum
                  isLoading={false}
                  images={yearSet.results}
                  handleImageClick={handleImageClick}
                  yearIndex={index}
                />
              </div>
            );
          } else
            return (
              <div key={index}>
                <p>{yearSet.year}</p>
                <ImagesListAlbum
                  isLoading={false}
                  images={yearSet.results}
                  handleImageClick={handleImageClick}
                  yearIndex={index}
                />
              </div>
            );
        }
      })}
      {props.isLoading && (
        <div className={styles.spinner}>
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
    </div>
  );
}
export default AlbumCategoriesList;
