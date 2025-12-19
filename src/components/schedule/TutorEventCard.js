import React from "react";
import styles from "~/pages/tutor/schedule/TutorSchedule.module.scss";

function TutorEventCard({ data }) {
  return (
    <div className={`${styles.card} ${data.status === "pause" ? styles.pause : ""}`}>
      <div className={styles.title}>{data.subject}</div>
      <div className={styles.meta}>{data.time}</div>
      <div className={styles.student}>{data.student}</div>
      <div className={styles.meta}>{data.status === 'pause' ? 'Tạm ngưng' : ''}</div>
    </div>
  );
}

export default TutorEventCard;
