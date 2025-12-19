import styles from './CTASectionHead.module.scss';

function CTASectionHead() {
    return (
        <div className={styles.ctaHead}>
            <h2 className={styles.title}>Sẵn sàng bắt đầu hành trình học tập?</h2>
            <p className={styles.subtitle}>
                Đăng ký ngay hôm nay để kết nối với hàng ngàn gia sư chất lượng và tài liệu học tập phong phú
            </p>
        </div>
    );
}

export default CTASectionHead;
