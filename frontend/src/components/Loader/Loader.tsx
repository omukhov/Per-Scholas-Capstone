import styles from "./Loader.module.css";
import logoImg from "../../assets/logo.png";

export default function Loader() {
  return (
    <div
      className={styles.loaderOverlay}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.loader}>
        <div className={styles.ring}>
          <div className={styles.logo}></div>
        </div>

        <div className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
