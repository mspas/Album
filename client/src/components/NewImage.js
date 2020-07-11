import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/NewImage.module.sass";

function NewImage(props) {
  return (
    <div className={styles.newImagePanel}>
      <img src={props.image.imageData} alt={`New id = ${props.id}`} />
      <input
        id={`d-${props.id}`}
        type="textarea"
        placeholder="Opis zdjęcia - może zawierać: rok, miejscowość, dokładne miejsce, osoby."
        onChange={props.descriptionChangeHandler}
      />
      <input
        id={`y-${props.id}`}
        type="number"
        placeholder="Rok"
        onChange={props.yearChangeHandler}
      />
      <label htmlFor={`checkbox${props.id}`}>Czy ma zostać wyróżnione?</label>
      <input
        id={`h-${props.id}`}
        type="checkbox"
        onChange={props.highlightChangeHandler}
      />
      <FontAwesomeIcon
        id={`c-${props.id}`}
        className="panel-icon"
        icon={faTimes}
        onClick={props.deleteImageHandler}
      />
    </div>
  );
}

export default NewImage;
