import React from "react";
import styles from "./styles/ImageList.module.sass";
import { Button, Tooltip, Spinner, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEdit,
  faTrashAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

function ImageList(props) {
  const tooltipSelect = (props) => <Tooltip {...props}>Zaznacz</Tooltip>;
  const tooltipOverview = (props) => <Tooltip {...props}>Podgląd</Tooltip>;
  const tooltipEdit = (props) => <Tooltip {...props}>Edytuj</Tooltip>;
  const tooltipDelete = (props) => <Tooltip {...props}>Usuń</Tooltip>;

  return (
    <div className={styles.list}>
      {props.isLoading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
      ) : (
        <div className={styles.imagesWrap}>
          {props.images.map((image, index) => {
            return (
              <div
                key={index}
                className={
                  props.selectedImages[index]
                    ? `${styles.imageBox} ${styles.selected}`
                    : styles.imageBox
                }
              >
                <div className={styles.iconsBox}>
                  <OverlayTrigger placement="right" overlay={tooltipSelect}>
                    <Button
                      className={`${styles.iconWrap} center`}
                      size="sm"
                      onClick={(event) => {
                        props.selectImage(event, index);
                      }}
                    >
                      <FontAwesomeIcon
                        id={`select-${index}`}
                        className={`panel-icon ${styles.icon}`}
                        icon={faCheckCircle}
                      />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="right" overlay={tooltipOverview}>
                    <Button
                      className={`${styles.iconWrap} center`}
                      size="sm"
                      onClick={(event) => {
                        props.setModal(event, index);
                        props.hideLogout(true);
                      }}
                    >
                      <FontAwesomeIcon
                        id={`overview-${index}`}
                        className={`panel-icon ${styles.icon}`}
                        icon={faEye}
                      />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="right" overlay={tooltipEdit}>
                    <Button
                      className={`${styles.iconWrap} center`}
                      size="sm"
                      onClick={(event) => {
                        props.setImageEdit(event, index);
                      }}
                    >
                      <FontAwesomeIcon
                        className={`panel-icon ${styles.icon}`}
                        icon={faEdit}
                      />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="right" overlay={tooltipDelete}>
                    <Button
                      className={`${styles.iconWrap} center`}
                      size="sm"
                      onClick={(event) => {
                        props.deleteImage(event, index);
                      }}
                    >
                      <FontAwesomeIcon
                        className={`panel-icon ${styles.icon}`}
                        icon={faTrashAlt}
                      />
                    </Button>
                  </OverlayTrigger>
                </div>
                <img src={image.url} alt={image.public_id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ImageList;
