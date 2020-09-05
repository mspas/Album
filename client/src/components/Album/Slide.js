import React from "react";
import styles from "./styles/Slide.module.sass";

const Slide = (props) => {
  return (
    <div>
      {props.image ? (
        <div className={styles.slideWrap}>
          <div className={styles.slide}>
            <p className={styles.year}>{props.image.year}</p>
            <div className={styles.imgWrap}>
              <img
                src={props.image.url}
                alt={props.image.public_id}
                onClick={props.handleImageClick}
              />
            </div>
            <div className={styles.descriptionWrap}>
              <p>{props.image.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>There is no picture here!</p>
      )}
    </div>
  );
};
export default Slide;
