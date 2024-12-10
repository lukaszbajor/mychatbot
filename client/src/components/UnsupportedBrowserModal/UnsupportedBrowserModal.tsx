import ReactDOM from "react-dom";
import styles from "./UnsupportedBrowserModal.module.css";

type UnsupportedBrowserModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const UnsupportedBrowserModal = ({
  onClose,
  children,
}: UnsupportedBrowserModalProps) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Nieobsługiwana przeglądarka</h2>
        <p>{children}</p>
        <button onClick={onClose} className={styles.closeButton}>
          Zamknij
        </button>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default UnsupportedBrowserModal;
