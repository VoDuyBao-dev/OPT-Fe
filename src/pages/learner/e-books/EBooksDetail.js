import React from "react";
import styles from "./EBooks.module.scss";

export default function EbookDetail({ data, onClose }) {
    const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [month, day, year] = dateStr.split("-");
    return `${day}/${month}/${year}`;
    };

  return (
    <div className={styles["modal-bg"]}>
      <div className={styles["modal-box"]}>
        <div className={styles["modal-header"]}>
            <h3>{data.title}</h3>
            <button className={styles["modal-close"]} onClick={onClose}>X</button>
        </div>
        <p>{data.desc}</p>

        <div className={styles["modal-info-grid"]}>
          <div><b>Môn học:</b> Công nghệ Web</div>
          <div><b>Người đăng:</b> {data.uploadedByName}</div>
          <div><b>Ngày cập nhật:</b> {formatDate(data.createdAt)}</div>
          <div><b>Loại:</b> {data.type}</div>
        </div>

        <button className={styles["btn-primary"]}>Xem Online</button>
        <button className={styles["btn-secondary"]}>Tải xuống</button>

        
      </div>
    </div>
  );
}
