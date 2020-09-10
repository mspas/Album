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
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [moveDisabled, setMoveDisabled] = useState(false);
  const [lastPosition, setLastPosition] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const [prevDirection, setPrevDirection] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const sliderRef = useRef();
  const activeSlideRef = useRef();
  const GALLERY_WIDTH = 8;

  useEffect(() => {
    if (props.activeIndex > -1) {
      setActiveIndex(props.activeIndex);
      setLeftIndex(props.activeIndex - 1);
      setRightIndex(props.activeIndex + 1);
    }
    setGallery(props.images, props.activeIndex);
  }, [props.activeIndex]);

  const setGallery = (images, index) => {
    if (props.left.length > 0 && !props.isPreview) {
      if (
        activeIndex + GALLERY_WIDTH + 2 > props.images.length ||
        props.images.length < GALLERY_WIDTH * 2
      ) {
        props.fetchData(props.left, true);
      }
    }

    let start = 0;
    if (index > GALLERY_WIDTH) {
      start =
        index + GALLERY_WIDTH > images.length
          ? images.length - GALLERY_WIDTH * 2
          : index - GALLERY_WIDTH;
    }

    let end = 0;
    if (index < GALLERY_WIDTH) {
      end =
        GALLERY_WIDTH * 2 > images.length ? images.length : GALLERY_WIDTH * 2;
    } else {
      end =
        index + GALLERY_WIDTH > images.length
          ? images.length
          : index + GALLERY_WIDTH;
    }

    let temp = [];

    if (images.length > 0) {
      for (let i = start; i < end; i++) {
        temp.push(images[i]);
      }
      setGalleryItems(temp);
    }
  };

  const moveSlide = (direction) => {
    let value = -100 * direction;
    if (sliderRef.current) {
      sliderRef.current.style.transitionDuration = "1s";
      sliderRef.current.style.transform = `translate( ${value}vw,0)`;
    }
    setIsMoving(true);
    setMoveDisabled(true);
  };

  const setStartingPos = () => {
    if (sliderRef.current) {
      sliderRef.current.style.transitionDuration = "0s";
      sliderRef.current.style.transform = "translate(0,0)";
    }
    setMoveDisabled(false);
  };

  const handleArrowClick = (direction) => {
    if (
      (activeIndex < 1 && direction < 0) ||
      (activeIndex > props.images.length - 2 && direction > 0) ||
      moveDisabled
    )
      return false;

    let nextIndex = activeIndex + direction;
    setGallery(props.images, nextIndex);
    moveSlide(direction);
    setTimeout(() => {
      setActiveIndex(nextIndex);
      setLeftIndex(nextIndex - 1);
      setRightIndex(nextIndex + 1);
      setStartingPos();
      setIsMoving(false);
    }, 1000);
  };

  const handleGalleryImageClick = (image) => {
    let nextIndex = props.images.indexOf(image);

    if (activeIndex === nextIndex || moveDisabled) return false;
    console.log(nextIndex, props.images.length);

    let direction = activeIndex > nextIndex ? -1 : 1;

    if (direction > 0) setRightIndex(nextIndex);
    else setLeftIndex(nextIndex);

    setGallery(props.images, nextIndex);

    moveSlide(direction);
    setTimeout(() => {
      setActiveIndex(nextIndex);
      setLeftIndex(nextIndex - 1);
      setRightIndex(nextIndex + 1);
      setStartingPos();
      setIsMoving(false);
    }, 1000);
  };

  const handleImageClick = () => {
    let win = window.open(props.images[activeIndex].url, "_blank");
    win.focus();
  };

  const handleTouchStart = (event) => {
    let clientX = event.targetTouches[0].clientX;
    setStartPosition(clientX);
  };

  const checkSwipeDirection = (clientX) => {
    return clientX - lastPosition < 0 ? -1 : 1;
  };

  const handleTouchMove = (event) => {
    if (isMoving) return false;

    let clientX = event.targetTouches[0].clientX;
    let direction = checkSwipeDirection(clientX);

    let start = direction !== prevDirection ? clientX : startPosition;

    if (sliderRef.current && activeSlideRef.current) {
      let value = 0;
      let rect = activeSlideRef.current.getBoundingClientRect();

      value = (rect.left + (start - clientX)) / -2;

      setStartPosition(start);
      setLastPosition(clientX);
      setPrevDirection(direction);

      if (activeIndex < 1 && direction > 0 && rect.left <= 0) value = 0;
      if (
        activeIndex > props.images.length - 2 &&
        direction < 0 &&
        rect.right > window.innerWidth - 10
      )
        value = 0;
      sliderRef.current.style.transform = `translate( ${value}px,0)`;
    }
  };

  const handleTouchEnd = () => {
    if (isMoving) return false;

    let rect = activeSlideRef.current.getBoundingClientRect();
    if (activeIndex < 1 && prevDirection > 0 && rect.left <= 0) {
      setStartingPos();
      return false;
    }
    if (rect.left > -70 && rect.right < window.innerWidth + 70)
      setStartingPos();
    else {
      let nextIndex = -1 * prevDirection + activeIndex;
      moveSlide(-1 * prevDirection);
      setTimeout(() => {
        setActiveIndex(nextIndex);
        setLeftIndex(nextIndex - 1);
        setRightIndex(nextIndex + 1);
        setStartingPos();
        setIsMoving(false);
      }, 1000);
    }
  };

  const galleryItemsList = galleryItems.map((image) => {
    return (
      <li
        key={image.url}
        className={
          props.images[activeIndex]._id === image._id
            ? `${styles.galleryItem} ${styles.activeItem}`
            : styles.galleryItem
        }
        style={{ backgroundImage: `url(${image.url})` }}
        onClick={() => {
          handleGalleryImageClick(image);
        }}
      ></li>
    );
  });

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
          <div className={styles.btnWrap}>
            <button
              className={
                activeIndex > 0
                  ? `${styles.btn} button`
                  : `${styles.btn} ${styles.btnDisabled} button`
              }
              disabled={moveDisabled}
              onClick={() => {
                handleArrowClick(-1);
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
              disabled={moveDisabled}
              onClick={() => {
                handleArrowClick(1);
              }}
            >
              <FontAwesomeIcon className={styles.abc} icon={faChevronRight} />
            </button>
          </div>
          <div className={styles.sliderWrap}>
            <div
              className={styles.slider}
              ref={sliderRef}
              onTouchStart={(event) => handleTouchStart(event)}
              onTouchMove={(event) => handleTouchMove(event)}
              onTouchEnd={handleTouchEnd}
            >
              <div className={styles.sliderSection}>
                <Slide
                  image={props.images[leftIndex]}
                  i={leftIndex}
                  handleImageClick={handleImageClick}
                />
              </div>
              <div className={styles.sliderSection} ref={activeSlideRef}>
                <Slide
                  image={props.images[activeIndex]}
                  i={activeIndex}
                  handleImageClick={handleImageClick}
                />
              </div>
              <div className={styles.sliderSection}>
                <Slide
                  image={props.images[rightIndex]}
                  i={rightIndex}
                  handleImageClick={handleImageClick}
                />
              </div>
            </div>
          </div>
          <div className={styles.galleryContainer}>
            <ul className={styles.gallery}>{galleryItemsList}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

ImageSlider.defaultProps = {
  images: [],
  show: false,
};

export default ImageSlider;
