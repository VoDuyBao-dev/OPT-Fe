import React from "react";
import styles from "~/pages/learner/schedule/Schedule.module.scss"


function EventCard({ data }) {
  return (
    <div className={`${styles.card} ${data.status==="pause"?styles.pause:""}`}>
      <div className={styles.title}>{data.subject}</div>
      <div className={styles.meta}>{data.time}</div>
      <div className={styles.tutor}>{data.tutor}</div>
      <div className={styles.meta}>{data.status === 'pause' ? 'Tạm ngưng':''}</div>
    </div>
  );
}

export default EventCard;
 