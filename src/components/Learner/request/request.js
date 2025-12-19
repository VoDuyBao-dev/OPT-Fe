import React from "react";
import styles from '~/components/Learner/profile/Profile.module.scss';

// ----- Requests Tab -----
function RequestsTab({ requests, onViewRequest }) {
  
  return (
    <div className={styles['ld-card']}>
      <h3>Lịch sử yêu cầu</h3>
      {requests.length === 0 ? (
        <p className={styles['muted']}>Bạn chưa gửi yêu cầu nào.</p>
      ) : (
        <table className={styles['ld-table']}>
          <thead>
            <tr>
              <th>Hình thức</th>
              <th>Gia sư</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.type === 'trial' ? 'Học thử' : 'Học chính thức'}</td>
                <td>{r.tutor}</td>
                <td>{r.date}</td>
                <td><span className={`${styles.status} ${styles[r.status]}`}>{r.statusLabel}</span></td>
                <td>
                  <button 
                    className={styles['link']} 
                    onClick={() => onViewRequest(r)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RequestsTab;

