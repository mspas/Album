import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/ImageSlider.module.sass";
import Slide from "./Slide";

const ImageSlider = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [btnsDisabled, setBtnsDisabled] = useState(false);
  const sliderRef = useRef();

  useEffect(() => {
    if (props.activeIndex > -1) setActiveIndex(props.activeIndex);
  }, [props.activeIndex]);

  const moveSlide = (direction) => {
    let value = 100 * direction;
    sliderRef.current.style.transitionDuration = "1s";
    sliderRef.current.style.transform = `translate( ${value}vw,0)`;
    setBtnsDisabled(true);
  };

  const setStartingPos = () => {
    sliderRef.current.style.transitionDuration = "0s";
    sliderRef.current.style.transform = "translate(0,0)";
    setBtnsDisabled(false);
  };

  return (
    <div>
      {props.show && (
        <div className={`${styles.modal} center`}>
          <div className={styles.overlay} onClick={props.onHide}></div>
          <div className={styles.header}>
            <button className={styles.btnClose} onClick={props.onHide}>
              <FontAwesomeIcon
                className={`${styles.closeIcon} panel-icon`}
                icon={faTimes}
              />
            </button>
          </div>
          <button
            className={
              activeIndex > 0
                ? `${styles.btn} button`
                : `${styles.btn} ${styles.btnDisabled} button`
            }
            disabled={btnsDisabled}
            onClick={() => {
              if (activeIndex > 0) {
                moveSlide(1);
                setTimeout(() => {
                  setActiveIndex(activeIndex - 1);
                  setStartingPos();
                }, 1000);
              }
            }}
          >
            <FontAwesomeIcon className={styles.abc} icon={faChevronLeft} />
          </button>
          <button
            className={
              activeIndex < props.images.length - 1
                ? `${styles.btn} button`
                : `${styles.btn} ${styles.btnDisabled} button`
            }
            disabled={btnsDisabled}
            onClick={() => {
              if (activeIndex < props.images.length - 1) {
                moveSlide(-1);
                setTimeout(() => {
                  setActiveIndex(activeIndex + 1);
                  setStartingPos();
                }, 1000);
              }
            }}
          >
            <FontAwesomeIcon className={styles.abc} icon={faChevronRight} />
          </button>
          <div className={styles.sliderWrap}>
            <div className={styles.slider} ref={sliderRef}>
              <div className={styles.content}>
                <div className={styles.slide}>
                  <Slide
                    image={props.images[activeIndex - 1]}
                    i={activeIndex - 1}
                  />
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.slide}>
                  <Slide image={props.images[activeIndex]} i={activeIndex} />
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.slide}>
                  <Slide
                    image={props.images[activeIndex + 1]}
                    i={activeIndex + 1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageSlider;
