import React, { useState, useEffect } from "react";
import { Col, Row, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/EditImage.module.sass";
import AuthService from "../../services/auth.service";

function EditImage(props) {
  const [imageData, setImageData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ alertType: true, alertText: "" });

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
    image.isHighlighted = event.target.value;
    setImageData(image);
  };

  const imageUploadHandler = async () => {
    const _auth = new AuthService();
    setIsLoading(true);
    let check = true;

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
            alertType: json.result,
            alertText: json.errorInfo,
          };
          setAlert(temp);
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
      imageData.year < 1800
    ) {
      alertT.alertText = "Error! Brak poprawnej daty!";
      alertT.alertType = false;
      check = false;
    }
    if (imageData.description === null || imageData.description.length < 1) {
      alertT.alertText = "Error! Opis nie może być pusty!";
      alertT.alertType = false;
      check = false;
    }
    setAlert(alertT);
    return check;
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
          <Row className={`${styles.mediaBodyHeading} mt-0`}>
            <Col>
              <input
                className={styles.yearInput}
                type="number"
                defaultValue={imageData.year}
                onChange={yearChangeHandler}
              />
            </Col>
            <Col xs={6} className={`${styles.highlight} center`}>
              <label htmlFor={`h${props.id}`}>Wyróżnione?</label>
              <input
                id={`h-${props.id}`}
                value={imageData.isHighlighted}
                className={styles.checkboxInput}
                type="checkbox"
                onChange={highlightChangeHandler}
              />
            </Col>
          </Row>
          <textarea
            className={styles.description}
            defaultValue={props.image.description}
            type="textarea"
            rows="6"
            placeholder="Opis zdjęcia - może zawierać: data, miejscowość, dokładne miejsce, osoby."
            onChange={descriptionChangeHandler}
          />
        </div>
        {alert.alertText && (
          <div className={styles.mediaFooter}>
            <p
              className={
                alert.alertType
                  ? `${styles.alert} ${styles.success}`
                  : `${styles.alert} ${styles.error}`
              }
            >
              {alert.alertText}
            </p>
          </div>
        )}
      </div>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
      )}
      <Button
        className={`${styles.buttonSend} button`}
        onClick={imageUploadHandler}
      >
        Wyślij
      </Button>
    </div>
  );
}

export default EditImage;
