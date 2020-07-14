import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/ImageOverviewModal.module.sass";

const ImageOverviewModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className={styles.modal}>
        <Modal.Title id="contained-modal-title-vcenter">
          Podgląd zdjęcia:
        </Modal.Title>
        <FontAwesomeIcon
          className={`${styles.closeIcon} panel-icon`}
          icon={faTimes}
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className={`${styles.modal}`}>
        <div className="center" style={{ width: "100%" }}>
          <img src={props.image_url} alt={props.public_id} />
        </div>
        <p style={{ marginBottom: 10 }}>Rok: {props.year}</p>
        <p>Opis:</p>
        <p>{props.description}</p>
      </Modal.Body>
      <Modal.Footer className={styles.modal}>
        <Button className="button" onClick={props.onHide}>
          Zamknij
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ImageOverviewModal;
