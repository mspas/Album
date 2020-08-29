import React, { useState } from "react";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../services/auth.service";
import styles from "./styles/SignIn.module.sass";
import logo from "../../assets/logo-text.png";
import Alert from "../Alert";

function SignIn(props) {
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    success: true,
    message: "",
  });
  const _auth = new AuthService();

  const inputChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    _auth
      .login(password)
      .then((res) => {
        setIsLoading(false);
        if (!res.success) {
          console.log(res);
          setError(res);
          setShowError(true);
        } else props.history.replace("/admin");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className={styles.signIn + " center"}>
      <div className={styles.panelSignIn}>
        <div className={styles.header}>
          <img src={logo} alt="Logo" />
        </div>

        {isLoading && (
          <div className={styles.spinner}>
            <Spinner
              animation="border"
              variant="primary"
              role="status"
            ></Spinner>
          </div>
        )}

        <Form className={styles.formSignIn} onSubmit={onSubmit}>
          <Form.Group controlId="formPassword">
            <span className={styles.info}>
              Album Paradyż - panel administratora
            </span>
            <InputGroup className={styles.input}>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                  <FontAwesomeIcon className="panel-icon" icon={faLock} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="password"
                name="Password"
                placeholder="Hasło"
                aria-describedby="inputGroupPrepend"
                onChange={inputChangeHandler}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please type your password.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Alert show={showError} type={error.success} text={error.message} />

          <button
            className={`${styles.btnSend} button`}
            variant="primary"
            type="submit"
          >
            Zaloguj
          </button>
        </Form>
      </div>
    </div>
  );
}

export default SignIn;
