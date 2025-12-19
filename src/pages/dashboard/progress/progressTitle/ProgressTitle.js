import styles from './ProgressTitle.module.scss';

function ProgressTitle() {
    return (
        <div className={styles.progressTitle}>
            <h2 className={styles.title}>Hệ thống hoạt động như thế nào?</h2>
            <p className={styles.subtitle}>Chỉ với 4 bước đơn giản, bạn đã có thể bắt đầu học tập</p>
        </div>
    );
}

export default ProgressTitle;
