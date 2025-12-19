import styles from './StepCard.module.scss';

function StepCard({ icon, number, title, description }) {
    return (
        <div className={styles.stepCard}>
            <div className={styles.iconWrapper}>
                {icon}
            </div>
            <div className={styles.content}>
                <h3 className={styles.stepTitle}>
                    {number}. {title}
                </h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}

export default StepCard;
