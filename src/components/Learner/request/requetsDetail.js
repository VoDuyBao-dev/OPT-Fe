import React from "react";
import styles from "../profile/Profile.module.scss";

export default function RequestDetailModal({ open, onClose, request }) {
  if (!open) return null;

  return (
    <div className={styles["ld-modal-overlay"]} onClick={onClose}>
      <div className={styles["ld-modal"]} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles["ld-modal-close"]} onClick={onClose}>
          &times;
        </button>

        <div className={styles["ld-request-wrapper"]}>
        <div className={styles["ld-request-title"]}>Chi tiết yêu cầu</div>

        <div className={styles["ld-request-info"]}>
            <div className={styles["ld-request-label"]}>Môn:</div>
            <div className={styles["ld-request-value"]}>{request.subject}</div>

            <div className={styles["ld-request-label"]}>Gia sư:</div>
            <div className={styles["ld-request-value"]}>{request.tutor}</div>

            <div className={styles["ld-request-label"]}>Thời gian học:</div>
            <div className={styles["ld-request-value"]}>{request.schedule}</div>

            <div className={styles["ld-request-label"]}>Hình thức:</div>
            <div className={styles["ld-request-value"]}>{request.type === 'trial' ? 'Học thử' : 'Học chính thức'}</div>

            <div className={styles["ld-request-label"]}>Trạng thái:</div>
            <div className={styles["ld-request-value"]}>{request.statusLabel}</div>
        </div>

        <div className={styles["ld-request-note"]}>
            Ghi chú: {request.note}
        </div>
        </div>
        
        <div className={styles["ld-modal-actions"]}>
          <button className={`${styles.btn} ${styles["btn-secondary"]}`} onClick={onClose}>Đóng</button>
        </div>

      </div>
    </div>
  );
}

