import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../NewImage.module.sass";
import AuthService from "../../services/auth.service";
import ImageSlider from "../Album/ImageSlider";
import Alert from "../Alert";

function EditImage(props) {
  const [imageData, setImageData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ alertType: true, alertText: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderImages, setSliderImages] = useState({});

  useEffect(() => {
    setImageData(props.image);
  }, [props.image]);

  const descriptionChangeHandler = (event) => {
    let image = imageData;
    image.description = event.target.value;
    setImageData(image);
  };

  const yearChangeHandler = (event) => {
    let image = imageData;
    image.year = event.target.value;
    setImageData(image);
  };

  const highlightChangeHandler = (event) => {
    let image = imageData;
    image.isHighlighted = event.target.checked;
    setImageData(image);
  };

  const imageUploadHandler = async () => {
    const _auth = new AuthService();
    let check = true;

    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    await new Promise((resolve, reject) => {
      check = validateData(imageData);
      resolve(imageData);
    });
    if (check)
      _auth
        .fetch("/api/edit-image", {
          method: "PATCH",
          body: JSON.stringify({
            image: imageData,
          }),
        })
        .then((json) => {
          let temp = {
            alertType: json.result, //na nowe to json.success
            alertText: json.errorInfo,
          };
          setAlert(temp);
          setShowAlert(true);
          setIsLoading(false);
        });
    else setIsLoading(false);
  };

  const validateData = (imageData) => {
    let check = true;
    let alertT = alert;
    if (
      imageData.year === null ||
      imageData.year > 2020 ||
      imageData.year < 1850
    ) {
      alertT.alertText =
        "Error! Brak poprawnej daty! Musi być 1850 < data < 2020";
      alertT.alertType = false;
      check = false;
    }
    if (imageData.description === null || imageData.description.length < 1) {
      alertT.alertText = "Error! Opis nie może być pusty!";
      alertT.alertType = false;
      check = false;
    }
    setAlert(alertT);
    setShowAlert(true);
    return check;
  };

  const handleShow = (index) => {
    setSliderImages([imageData]);
    setShowSlider(true);
    props.hideLogout(true);
  };

  return (
    <div className={styles.wrap}>
      <Button
        variant="light"
        onClick={props.onBack}
        className={`${styles.button} button center`}
      >
        <FontAwesomeIcon
          className={`${styles.backIcon} panel-icon`}
          icon={faArrowLeft}
        />
        <span>Wstecz</span>
      </Button>
      <div className={`${styles.newImagePanel}`}>
        <div className={`${styles.imageWrap}`}>
          <img
            id="edit-image"
            className="mr-3"
            src={props.image.url}
            alt="edit"
          />
          <label className={styles.imageOverview} htmlFor="edit-image">
            Podgląd
          </label>
        </div>
        <div className={`${styles.mediaBody}`}>
          <div className={`${styles.mediaBodyHeading} mt-0`}>
            <div>
              <input
                className={styles.yearInput}
                type="number"
                defaultValue={imageData.year}
                onChange={yearChangeHandler}
              />
            </div>
            <div className={`${styles.highlight} center`}>
              <label htmlFor={`h${props.id}`}>Wyróżnione?</label>
              <input
                id={`h-${props.id}`}
                defaultChecked={imageData.isHighlighted}
                className={styles.checkboxInput}
                type="checkbox"
                onChange={highlightChangeHandler}
              />
            </div>
          </div>
          <textarea
            className={styles.description}
            defaultValue={props.image.description}
            type="textarea"
            rows="6"
            placeholder="Opis zdjęcia - może zawierać: data, miejscowość, dokładne miejsce, osoby."
            onChange={descriptionChangeHandler}
          />
        </div>
        <Alert show={showAlert} type={alert.alertType} text={alert.alertText} />
      </div>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
      )}
      <button className={`${styles.btnShow} button`} onClick={handleShow}>
        Podgląd przed dodaniem
      </button>
      <button
        className={`${styles.buttonSend} button`}
        onClick={imageUploadHandler}
      >
        Wyślij
      </button>
      <ImageSlider
        show={showSlider}
        onHide={() => {
          setShowSlider(false);
          props.hideLogout(false);
        }}
        images={sliderImages}
        activeIndex={0}
        left={[]}
        fetchData={null}
        isPreview={true}
      />
    </div>
  );
}

export default EditImage;
