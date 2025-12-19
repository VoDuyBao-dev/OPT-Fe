import React, { useState, useEffect } from "react";
import styles from "./AdminEbooks.module.scss";

export default function AdminEbookModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    title: "",
    type: "TAI_LIEU",
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  if (!open) return null;

  return (
    <div className={styles.modalBg}>
      <div className={styles.modalBox}>
        <h3>{initial ? "Cập nhật Ebook" : "Thêm Ebook"}</h3>

        <input
          placeholder="Tiêu đề"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="SACH_GIAO_KHOA">Sách giáo khoa</option>
          <option value="TAI_LIEU">Tài liệu</option>
          <option value="DE_THI_THAM_KHAO">Đề thi tham khảo</option>
        </select>

        <div className={styles.modalActions}>
          <button onClick={() => onSubmit(form)} className={styles.btnPrimary}>
            Lưu
          </button>
          <button onClick={onClose} className={styles.btnLight}>
            Huỷ
          </button>
        </div>
      </div>
    </div>
  );
}
