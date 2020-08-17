import React from "react";
import styles from "./styles/Slide.module.sass";

const Slide = (props) => {
  return (
    <div className={styles.slide}>
      <div className={styles.imgWrap}>
        <img src={props.image.url} alt={props.image.public_id} />
      </div>
      <div className={styles.descriptionWrap}>
        <p>{props.image.description}</p>
      </div>
    </div>
  );
};
export default Slide;
