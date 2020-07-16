import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./ConfirmModal.module.sass";

const ConfirmModal = (props) => {
  return (
    <div>
      {props.show && (
        <div className={`${styles.modal} center`}>
          <div className={styles.overlay} onClick={props.onHide}></div>
          <div className={styles.content}>
            <div className={styles.heading}>
              <FontAwesomeIcon
                className={`${styles.closeIcon} panel-icon`}
                icon={faTimes}
                onClick={props.onHide}
              />
            </div>
            <div className={`${styles.body} center`}>
              <p>{props.text}</p>
              {props.imageId !== -1 && (
                <div className={styles.alertBox}>
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
            <div className={styles.footer}>
              {props.alertType && (
                <Button className="button" onClick={props.accept}>
                  Tak
                </Button>
              )}
              <Button className="button" onClick={props.onHide}>
                Anuluj
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ConfirmModal;
