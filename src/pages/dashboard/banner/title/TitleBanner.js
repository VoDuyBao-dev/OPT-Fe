import styles from './TitleBanner.module.scss';

function TitleBanner() {
    return (
        <div className={styles.titleWrapper}>
            <h1 className={styles.mainTitle}>
                Tìm kiếm gia sư chất lượng chưa bao giờ dễ dàng hơn
            </h1>
            <p className={styles.subTitle}>
                Kết nối tri thức – Nâng tầm tương lai. Hệ thống kết nối gia sư và học viên hàng đầu Việt Nam.
            </p>
        </div>
    );
}

export default TitleBanner;
