import clsx from 'clsx';
import styles from './NotifiDropdown.module.scss'
import Modal from '~/components/modal/Modal';
function NotifiDropdown({ listNotifi, className }) {
    return (
        <div className={clsx(styles.notification, className)}>
            <div className={styles.notificationCtn}>
                <div className={styles.notificationHeader}>
                    <span className={styles.notificationTitle}>Thông báo</span>
                </div>
                <div className={styles.notificationBody}>
                    <ul className={styles.notificationList}>
                        {listNotifi.map((notifi, index) => (
                            <li key={index} className={clsx(styles.notificationItem, { [styles.isRead]: notifi.isRead })}>
                                <span className={styles.notificationItemTitle}>{notifi.title}</span>
                                <p className={styles.notificationItemContent}>{notifi.content}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Modal type='default'></Modal>
        </div>
    );
}

export default NotifiDropdown;