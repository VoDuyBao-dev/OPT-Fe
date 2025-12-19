
import clsx from 'clsx';
import styles from './CardItem.module.scss';
function CardItem({ imgSrc, fullNameLearner, address, subject, startDate, endDate, className }) {
    return ( 
        <div className={clsx(styles.cardItem, className)}>
            <div className={styles.card}>
                <div className={styles.cardImg}>
                    <img src={imgSrc} alt="Learner Avatar" />
                </div>
                <div className={styles.cardContent}>
                    <p className={styles.learnerName}>
                        <strong>Học viên: </strong>
                        {fullNameLearner}</p>
                    <p className={styles.address}>
                        <strong>Địa chỉ: </strong>
                        {address}</p>
                    <p className={styles.subject}>
                        <strong>Môn học: </strong>
                        {subject}</p>
                    <p className={styles.date}>
                        <strong>Thời gian: </strong>
                        {startDate} - {endDate}</p>
                </div>
            </div>
        </div>
     );
}

export default CardItem;    