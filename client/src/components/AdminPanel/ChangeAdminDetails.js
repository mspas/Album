import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../services/auth.service";
import styles from "./styles/ChangeAdminDetails.module.sass";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

function ChangeAdminDetails(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    alertType: false,
    alertText: "",
  });
  const [showError, setShowError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [swtichValue, setSwtichValue] = useState(true);

  const _auth = new AuthService();

  const onSubmitEmail = (event) => {
    event.preventDefault();
    let oldEmail = _auth.getEmail(_auth.getToken());

    setIsLoading(true);

    _auth
      .fetch("/api/change-email", {
        method: "PATCH",
        body: JSON.stringify({
          password: password,
          oldEmail: oldEmail,
          newEmail: email,
        }),
      })
      .then((json) => {
        setIsLoading(false);
        setError({
          alertType: json.result.success,
          alertText: json.result.errorInfo,
        });
        setShowError(true);
        _auth.setToken(json.token);
      });
  };

  const onSubmitPassword = (event) => {
    event.preventDefault();
    let email = _auth.getEmail(_auth.getToken());

    setIsLoading(true);

    if (newPassword !== newPasswordConfirmation) {
      setIsLoading(false);
      setError({
        alertType: false,
        alertText:
          "Wpisane nowe hasło różni się do tego wpisanego w pole potwierdzenia!",
      });
    } else
      _auth
        .fetch("/api/change-password", {
          method: "PATCH",
          body: JSON.stringify({
            email: email,
            oldPassword: password,
            newPassword: newPassword,
          }),
        })
        .then((json) => {
          setIsLoading(false);
          setShowError(true);
          setError({
            alertType: json.result.success,
            alertText: json.result.errorInfo,
          });
        });
  };

  return (
    <div className={styles.panelDetails}>
      <div className={`${styles.header} center`}>
        <span
          className={
            !swtichValue ? `${styles.active} ${styles.col}` : styles.col
          }
          onClick={() => {
            setSwtichValue(false);
            setShowError(false);
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
              setShowError(false);
            }}
          />
          <span className={styles.slider}></span>
        </label>
        <span
          className={
            swtichValue ? `${styles.active} ${styles.col}` : styles.col
          }
          onClick={() => {
            setSwtichValue(true);
            setShowError(false);
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
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
      )}
      {showError && (
        <div className={styles.alert}>
          <p
            className={
              error.alertType
                ? `${styles.alert} ${styles.success}`
                : `${styles.alert} ${styles.error}`
            }
          >
            {error.alertText}
          </p>
        </div>
      )}
      {!swtichValue ? (
        <ChangeEmail
          email={props.email}
          onChangeEmail={(event) => {
            setEmail(event.target.value);
          }}
          onChangePassword={(event) => {
            setPassword(event.target.value);
          }}
          onSubmit={onSubmitEmail}
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
          onSubmit={onSubmitPassword}
        />
      )}
    </div>
  );
}

export default ChangeAdminDetails;
