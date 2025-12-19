import React, { useState } from "react";
import styles from "~/components/Learner/profile/Profile.module.scss";

export function ReviewModal({
  open,
  onClose,
  onSubmit,
  classItem,
  loading = false,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!open) return null;

  const handleClose = () => {
    if (loading) return;
    onClose();
    setRating(5);
    setComment("");
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (loading) return;
    onSubmit({ rating, comment, image });
  };

  return (
    <div className={styles["ld-modal-overlay"]} onClick={handleClose}>
      <div
        className={styles["ld-modal"]}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles["ld-modal-close"]}
          onClick={handleClose}
          disabled={loading}
        >
          &times;
        </button>

        <h3>
          Viết đánh giá cho: <span>{classItem?.subjectName}</span>
        </h3>

        {/* Rating */}
        <div className={styles["ld-rating-row"]}>
          <label>Điểm:</label>
          <div className={styles["ld-stars"]}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                className={`${styles.star} ${
                  s <= rating ? styles.active : ""
                }`}
                onClick={() => setRating(s)}
                disabled={loading}
              >
                {s <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <textarea
          placeholder="Viết nhận xét của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />

        {/* Actions */}
        <div className={styles["ld-modal-actions"]}>
          <button
            className={`${styles.btn} ${styles["btn-secondary"]}`}
            onClick={handleClose}
            disabled={loading}
          >
            Hủy
          </button>

          <button
            className={`${styles.btn} ${styles["btn-primary"]}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
