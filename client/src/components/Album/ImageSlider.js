import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/ImageSlider.module.sass";

const ImageSlider = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (props.activeIndex > -1) setActiveIndex(props.activeIndex);
    console.log(props.activeIndex, props.images[props.activeIndex]);
  }, [props.activeIndex, props.images]);

  return (
    <div>
      {props.show && (
        <div className={`${styles.modal} center`}>
          <div className={styles.overlay} onClick={props.onHide}></div>
          <div className={styles.content}>
            <div className={styles.heading}>
              <button className={styles.btnClose} onClick={props.onHide}>
                <FontAwesomeIcon
                  className={`${styles.closeIcon} panel-icon`}
                  icon={faTimes}
                />
              </button>
            </div>
            <div className={styles.body}>
              <button
                className={`${styles.btn} button`}
                onClick={() => {
                  console.log(activeIndex);
                  if (activeIndex > 0) setActiveIndex(activeIndex - 1);
                }}
              >
                <FontAwesomeIcon className={styles.abc} icon={faChevronLeft} />
              </button>
              <div className={styles.sliderBox}>
                <div className={styles.imgWrap}>
                  <img
                    src={props.images[activeIndex].url}
                    alt={props.images[activeIndex].public_id}
                  />
                </div>
                <div className={styles.descriptionWrap}>
                  <p>{props.images[activeIndex].description}</p>
                </div>
              </div>
              <button
                className={`${styles.btn} button`}
                onClick={() => {
                  console.log(activeIndex);
                  if (activeIndex < props.images.length - 1)
                    setActiveIndex(activeIndex + 1);
                }}
              >
                <FontAwesomeIcon className={styles.abc} icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageSlider;
