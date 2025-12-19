import styles from './TopTutorHead.module.scss';

function TopTutorHead() {
    return (
        <div className={styles.topTutorHead}>
            <h2 className={styles.title}>Gia sư nổi bật</h2>
            <p className={styles.subtitle}>Những gia sư được đánh giá cao nhất trên hệ thống</p>
        </div>
    );
}

export default TopTutorHead;
