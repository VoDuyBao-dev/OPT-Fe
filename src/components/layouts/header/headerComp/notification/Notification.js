import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import NotifiDropdown from '~/components/dropdown/notifiDropdown/NotifiDropdown';
import { getNotifications } from '~/api/services/homeService';
import styles from './Notification.module.scss';

function Notification() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getNotifications();
                setItems(data || []);
            } catch (e) {
                console.error('Load notifications failed', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const unread = items.filter((i) => !i?.isRead).length;

    return (
        <div className={styles.notification} onClick={() => setOpen(!open)}>
            <div className={styles.notificationIcon}>
                <span className={styles.notificationIconItem}>
                    <FontAwesomeIcon icon={faBell} />
                </span>
                <span className={styles.notificationNumber}>{unread || items.length}</span>
            </div>
            {open && (
                <NotifiDropdown
                    listNotifi={items}
                    loading={loading}
                    className={styles.notificationDropdown}
                />
            )}
        </div>
    );
}

export default Notification;