import React from "react";
import styles from "./EBooks.module.scss";

export default function EbookDetail({ data, onClose }) {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className={styles["modal-bg"]} onClick={onClose}>
      <div
        className={styles["modal-box"]}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={styles["modal-header"]}>
          <h3>{data.title}</h3>
          <button
            className={styles["modal-close"]}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* INFO */}
        <div className={styles["modal-info-grid"]}>
          <div><b>Người đăng:</b> {data.author}</div>
          <div><b>Loại tài liệu:</b> {data.type}</div>
          <div><b>Ngày đăng:</b> {formatDate(data.date)}</div>
        </div>

        {/* ACTIONS */}
        <a
          href={data.path}
          target="_blank"
          rel="noopener noreferrer"
          className={styles["btn-primary"]}
        >
          📖 Xem Online
        </a>

        <a
          href={data.path}
          download
          className={styles["btn-secondary"]}
        >
          ⬇️ Tải xuống
        </a>
      </div>
    </div>
  );
}
