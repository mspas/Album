import React from "react";
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
            <div className={`${styles.mediaBodyHeading} mt-0`}>
              <div>
                <input
                  className={styles.yearInput}
                  type="number"
                  placeholder="Rok"
                  onChange={(event) => {
                    props.yearChangeHandler(event, props.id);
                  }}
                />
              </div>
              {props.admin && (
                <div className={`${styles.highlight} center`}>
                  <label htmlFor={`h${props.id}`}>Wyróżnione?</label>
                  <input
                    id={`h-${props.id}`}
                    className={styles.checkboxInput}
                    type="checkbox"
                    onChange={(event) => {
                      props.highlightChangeHandler(event, props.id);
                    }}
                  />
                </div>
              )}
              <div className={styles.closeWrap}>
                <FontAwesomeIcon
                  className={`${styles.closeIcon} panel-icon`}
                  icon={faTimes}
                  onClick={(event) => {
                    props.deleteImageHandler(event, props.id);
                  }}
                />
              </div>
            </div>
            <textarea
              className={styles.description}
              type="textarea"
              rows="6"
              placeholder="Opis zdjęcia - może zawierać: data, miejscowość, dokładne miejsce, osoby."
              onChange={(event) => {
                props.descriptionChangeHandler(event, props.id);
              }}
            />
            {props.admin && (
              <button
                className={`${styles.btnShow} button`}
                onClick={() => {
                  props.handleShow(props.id);
                }}
              >
                Podgląd przed dodaniem
              </button>
            )}
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
              multiple
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
