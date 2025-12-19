import styles from './BenefitItem.module.scss';

function BenefitItem({ icon, title, description, color = 'blue' }) {
    return (
        <div className={styles.benefitItem}>
            <div className={`${styles.iconWrapper} ${styles[color]}`}>
                {icon}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}

export default BenefitItem;
