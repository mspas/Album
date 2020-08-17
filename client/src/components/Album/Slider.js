import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/Slider.module.sass";
import Slide from "./Slide";

const Slider = (props) => {
  const [prevActiveIndex, setPrevActiveIndex] = useState(0);
  const sliderRef = useRef();

  useEffect(() => {
    if (props.activeIndex > prevActiveIndex)
      sliderRef.current.setAttribute("class", "slider animationSlideRight");

    if (props.activeIndex < prevActiveIndex)
      sliderRef.current.setAttribute("class", "slider animationSlideLeft");
    setPrevActiveIndex(props.activeIndex);
    console.log(props.activeIndex);
  }, [props.activeIndex]);

  return (
    <div className={styles.sliderBox} ref={sliderRef}>
      <div className={styles.slider}>
        <div className={styles.slide} id="slider-left">
          <Slide
            image={props.images[props.activeIndex - 1]}
            i={props.activeIndex - 1}
          />
        </div>
        <div className={styles.slide}>
          <Slide
            image={props.images[props.activeIndex]}
            i={props.activeIndex}
          />
        </div>
        <div className={styles.slide}>
          <Slide
            image={props.images[props.activeIndex + 1]}
            i={props.activeIndex + 1}
          />
        </div>
      </div>
    </div>
  );
};
export default Slider;
