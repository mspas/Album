import React, { useState, useRef } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../services/auth.service";
import styles from "./styles/ChangeAdminDetails.module.sass";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

function ChangeAdminDetails(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [swtichValue, setSwtichValue] = useState(true);

  const _auth = new AuthService();

  const inputChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(password);
    /*_auth
      .login(password)
      .then((res) => {
        props.history.replace("/admin");
      })
      .catch((err) => {
        alert(err);
      });*/
  };

  const onSwitchName = (check) => {
    setSwtichValue(check);
  };

  return (
    <div className={styles.panelDetails}>
      <div className={`${styles.header} center`}>
        <span
          className={
            !swtichValue ? `${styles.active} ${styles.col}` : styles.col
          }
          onClick={() => {
            setSwtichValue(!swtichValue);
          }}
        >
          Zmień e-mail
        </span>
        <label className={`${styles.switch} ${styles.col}`}>
          <input
            type="checkbox"
            checked={swtichValue}
            onChange={() => {
              setSwtichValue(!swtichValue);
            }}
          />
          <span className={styles.slider}></span>
        </label>
        <span
          className={
            swtichValue ? `${styles.active} ${styles.col}` : styles.col
          }
          onClick={() => {
            setSwtichValue(!swtichValue);
          }}
        >
          Zmień hasło
        </span>
      </div>
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
      {!swtichValue ? (
        <ChangeEmail
          email={props.email}
          onChangeEmail={(event) => {
            setEmail(event.target.value);
          }}
          onChangePassword={(event) => {
            setPassword(event.target.value);
          }}
          onSubmit={onSubmit}
        />
      ) : (
        <ChangePassword
          onChangePassword={(event) => {
            setPassword(event.target.value);
          }}
          onChangeNewPassword={(event) => {
            setNewPassword(event.target.value);
          }}
          onChangeNewPasswordConfirmation={(event) => {
            setNewPasswordConfirmation(event.target.value);
          }}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

export default ChangeAdminDetails;
