import styles from './BenefitsHead.module.scss';

function BenefitsHead() {
    return (
        <div className={styles.benefitsHead}>
            <h2 className={styles.title}>Lợi ích vượt trội</h2>
            <p className={styles.subtitle}>Giải pháp toàn diện cho cả học viên và gia sư</p>
        </div>
    );
}

export default BenefitsHead;
