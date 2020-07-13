import React from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/NewImage.module.sass";

function NewImage(props) {
  return (
    <div className={styles.wrap}>
      {props.image !== null ? (
        <div className={`${styles.newImagePanel} media`}>
          <img
            id={`i-${props.id}`}
            className="mr-3"
            src={props.image.imageData}
            alt={`New id = ${props.id}`}
          />
          <label className={styles.imageOverview} htmlFor={`i-${props.id}`}>
            Podgląd
          </label>
          <div className={`${styles.mediaBody} media-body`}>
            <Row className={`${styles.mediaBodyHeading} mt-0`}>
              <Col>
                <input
                  id={`y-${props.id}`}
                  className={styles.yearInput}
                  type="number"
                  placeholder="Rok"
                  onChange={props.yearChangeHandler}
                />
              </Col>
              <Col xs={6} className={`${styles.highlight} center`}>
                <label htmlFor={`h${props.id}`}>Wyróżnione?</label>
                <input
                  id={`h-${props.id}`}
                  className={styles.checkboxInput}
                  type="checkbox"
                  onChange={props.highlightChangeHandler}
                />
              </Col>
              <Col className={styles.closeWrap}>
                <FontAwesomeIcon
                  id={`c-${props.id}`}
                  className={`${styles.closeIcon} panel-icon`}
                  icon={faTimes}
                  onClick={props.deleteImageHandler}
                />
              </Col>
            </Row>
            <textarea
              id={`d-${props.id}`}
              className={styles.description}
              type="textarea"
              rows="6"
              placeholder="Opis zdjęcia - może zawierać: data, miejscowość, dokładne miejsce, osoby."
              onChange={props.descriptionChangeHandler}
            />
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
