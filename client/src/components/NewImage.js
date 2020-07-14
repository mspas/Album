import React from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./NewImage.module.sass";

function NewImage(props) {
  return (
    <div className={styles.wrap}>
      {props.id > -1 ? (
        <div className={`${styles.newImagePanel}`}>
          <div className={`${styles.imageWrap}`}>
            <img
              id={`i-${props.id}`}
              className="mr-3"
              src={props.imageURL}
              alt={`New id = ${props.id}`}
            />
            <label className={styles.imageOverview} htmlFor={`i-${props.id}`}>
              Podgląd
            </label>
          </div>
          <div className={`${styles.mediaBody}`}>
            <Row className={`${styles.mediaBodyHeading} mt-0`}>
              <Col>
                <input
                  className={styles.yearInput}
                  type="number"
                  placeholder="Rok"
                  onChange={(event) => {
                    props.yearChangeHandler(event, props.id);
                  }}
                />
              </Col>
              <Col xs={6} className={`${styles.highlight} center`}>
                <label htmlFor={`h${props.id}`}>Wyróżnione?</label>
                <input
                  id={`h-${props.id}`}
                  className={styles.checkboxInput}
                  type="checkbox"
                  onChange={(event) => {
                    props.highlightChangeHandler(event, props.id);
                  }}
                />
              </Col>
              <Col className={styles.closeWrap}>
                <FontAwesomeIcon
                  className={`${styles.closeIcon} panel-icon`}
                  icon={faTimes}
                  onClick={(event) => {
                    props.deleteImageHandler(event, props.id);
                  }}
                />
              </Col>
            </Row>
            <textarea
              className={styles.description}
              type="textarea"
              rows="6"
              placeholder="Opis zdjęcia - może zawierać: data, miejscowość, dokładne miejsce, osoby."
              onChange={(event) => {
                props.descriptionChangeHandler(event, props.id);
              }}
            />
            {props.alertText && (
              <div className={styles.mediaFooter}>
                <p
                  className={
                    props.alertType
                      ? `${styles.alert} ${styles.success}`
                      : `${styles.alert} ${styles.error}`
                  }
                >
                  {props.alertText}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.newImagePanel}>
          <div className={styles.addNewPanel}>
            <input
              type="file"
              id="inputfile"
              onChange={props.imageSelectedHandler}
              onClick={props.nullifySelector}
            />
            <label htmlFor="inputfile">
              <div className={`${styles.addNewBox} ${styles.box}`}>
                <div className="center">
                  <FontAwesomeIcon className={styles.addIcon} icon={faPlus} />
                </div>
              </div>
            </label>
            <div className={`${styles.text} ${styles.box}`}>
              <div className="center">
                <p>Dodaj zdjęcie...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewImage;
