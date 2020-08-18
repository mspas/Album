import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "./styles/HighlightedImagesList.module.sass";

function HighlightedImagesList(props) {
  return (
    <div className={styles.imagesContainer}>
      {props.isLoading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" role="status"></Spinner>
        </div>
      ) : (
        <div className={styles.content}>
          <ul className={styles.list}>
            {props.images.map((image, index) => {
              return (
                <li key={index} className={styles.imageBox}>
                  <div className={styles.imageWrap}>
                    <img
                      src={image.url}
                      alt={image.public_id}
                      onClick={() => {
                        props.handleImageClick(index);
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HighlightedImagesList;
