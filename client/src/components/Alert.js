import React from "react";
import styles from "./Alert.module.sass";

const Alert = (props) => {
  return (
    <div>
      {props.show && (
        <div className={styles.alertBox}>
          <p
            className={
              props.type
                ? `${styles.alert} ${styles.success}`
                : `${styles.alert} ${styles.error}`
            }
          >
            {props.text}
          </p>
        </div>
      )}
    </div>
  );
};
export default Alert;
