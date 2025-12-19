import React from "react";
import styles from "~/components/Learner/profile/Profile.module.scss";

function ClassesTab({ classes, onWriteReview }) {
  return (
    <div className={styles["ld-card"]}>
      <h3>Lớp đã học</h3>

      {classes.length === 0 ? (
        <p className={styles["muted"]}>
          Bạn chưa hoàn thành lớp học nào.
        </p>
      ) : (
        <div className={styles["ld-list"]}>
          {classes.map((c) => (
            <div className={styles["ld-item"]} key={c.classId}>
              <div className={styles["ld-item-left"]}>
                <img
                  src={`https://i.pravatar.cc/50?u=${c.tutorId}`}
                  alt={c.tutorName}
                />
              </div>

              <div className={styles["ld-item-body"]}>
                <div className={styles["ld-item-title"]}>
                  {c.subjectName}
                </div>
                <div className={`${styles["muted"]} ${styles["small"]}`}>
                  Gia sư: {c.tutorName} • {c.startDate} → {c.endDate}
                </div>
              </div>

              <div className={styles['ld-item-actions']}>
                {c.canRate ? (
                  <button
                    className={`${styles['btn']} ${styles['btn-outline']}`}
                    onClick={() => onWriteReview(c)}
                  >
                    Viết đánh giá
                  </button>
                ) : (
                  <span className={styles['muted']}>Đã đánh giá</span>
                )}

                <a className={styles['link']} href={`/Tutor/${c.tutorId}`}>
                  Xem chi tiết
                </a>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClassesTab;
