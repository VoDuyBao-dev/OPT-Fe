import styles from './PageHeader.module.scss';

function PageHeader({ pendingCount }) {
    return (
        <div className={styles.header}>
            <div>
                <h1>Danh sách yêu cầu</h1>
                <p className={styles.subtitle}>
                    Quản lý yêu cầu học thử và học chính thức từ học viên
                </p>
            </div>
            {pendingCount > 0 && (
                <div className={styles.pendingBadge}>
                    {pendingCount} yêu cầu đang chờ
                </div>
            )}
        </div>
    );
}

export default PageHeader;
