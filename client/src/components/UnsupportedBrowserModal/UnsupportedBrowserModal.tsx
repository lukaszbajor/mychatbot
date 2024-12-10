import ReactDOM from "react-dom";
import styles from "./UnsupportedBrowserModal.module.css";

const UnsupportedBrowserModal = ({ onClose }: { onClose: () => void }) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Nieobsługiwana przeglądarka</h2>
        <p>
          Twoja przeglądarka (Firefox) nie obsługuje funkcji rozpoznawania mowy.
          Aby skorzystać z tej funkcji, użyj Google Chrome lub innej
          przeglądarki opartej na Chromium.
        </p>
        <button onClick={onClose} className={styles.closeButton}>
          Zamknij
        </button>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default UnsupportedBrowserModal;
