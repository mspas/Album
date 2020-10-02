import React from "react";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/ImagesListAlbum.module.sass";

function ImagesListAlbum(props) {
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
                <li
                  key={index}
                  className={
                    props.isHighlighted
                      ? `${styles.imageBox} ${styles.flexBasisBig}`
                      : `${styles.imageBox} ${styles.flexBasisSmall}`
                  }
                >
                  <div
                    className={
                      props.isHighlighted
                        ? `${styles.imageBlock} ${styles.bigBlock}`
                        : `${styles.imageBlock} ${styles.smallBlock}`
                    }
                    onClick={() => {
                      props.handleImageClick(index, props.yearIndex);
                    }}
                  >
                    <div className={styles.imageWrap}>
                      <div
                        className={styles.image}
                        style={{ backgroundImage: `url(${image.url})` }}
                      ></div>
                      <span className={styles.detailsIcon}>
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </div>
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

export default ImagesListAlbum;
