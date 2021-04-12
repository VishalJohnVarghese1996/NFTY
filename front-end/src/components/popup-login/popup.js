import React from "react";
import styles from "./popup.module.css";

const Popup = () => {
  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner}>
        <a href="/login/patient">
          <button
            color="primary"
            variant="outlined"
            className={styles.loginButton1}
          >
            Login as Patient
          </button>
        </a>
        <a href="/login/doctor">
          <button
            color="primary"
            variant="outlined"
            className={styles.loginButton2}
          >
            Login as Doctor
          </button>
        </a>

        <a href="/login/admin">
          <button
            color="primary"
            variant="outlined"
            className={styles.loginButton3}
          >
            Login as Hospital Admin
          </button>
        </a>
      </div>
    </div>
  );
};

export default Popup;
