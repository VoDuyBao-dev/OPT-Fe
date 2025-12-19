import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faBook, 
    faCalendar, 
    faClock, 
    faMoneyBill 
} from '@fortawesome/free-solid-svg-icons';
import styles from './RequestCard.module.scss';

function RequestCard({ request, onAccept, onReject }) {
    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: 'Chờ xử lý', className: styles.pending },
            accepted: { label: 'Đã chấp nhận', className: styles.accepted },
            rejected: { label: 'Đã từ chối', className: styles.rejected }
        };
        return statusMap[status] || statusMap.pending;
    };

    const getTypeBadge = (type) => {
        return type === 'trial' 
            ? { label: 'Học thử', className: styles.trial }
            : { label: 'Học chính thức', className: styles.official };
    };

    const statusBadge = getStatusBadge(request.status);
    const typeBadge = getTypeBadge(request.type);

    return (
        <div className={styles.requestCard}>
            <div className={styles.cardHeader}>
                <div className={styles.badges}>
                    <span className={`${styles.badge} ${statusBadge.className}`}>
                        {statusBadge.label}
                    </span>
                    <span className={`${styles.badge} ${typeBadge.className}`}>
                        {typeBadge.label}
                    </span>
                </div>
                <span className={styles.date}>
                    {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                </span>
            </div>

            <div className={styles.cardBody}>
                <div className={styles.mainInfo}>
                    <div className={styles.learnerInfo}>
                        <FontAwesomeIcon icon={faUser} />
                        <div>
                            <h3>{request.learnerName}</h3>
                            <span>{request.learnerAge} tuổi - {request.grade}</span>
                        </div>
                    </div>

                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <FontAwesomeIcon icon={faBook} />
                            <span>{request.subject}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <FontAwesomeIcon icon={faCalendar} />
                            <span>{request.schedule}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <FontAwesomeIcon icon={faClock} />
                            <span>Bắt đầu: {new Date(request.startDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <FontAwesomeIcon icon={faMoneyBill} />
                            <span>{request.price} - {request.duration}</span>
                        </div>
                    </div>

                    {/* TODO: Uncomment when message feature is ready */}
                    <div className={styles.message}>
                        <strong>Tin nhắn:</strong>
                        <p>{request.message}</p>
                    </div>
                </div>

                {request.status === 'pending' && (
                    <RequestActions 
                        onAccept={() => onAccept(request.id)}
                        onReject={() => onReject(request)}
                    />
                )}
            </div>
        </div>
    );
}

function RequestActions({ onAccept, onReject }) {
    const { faCheck, faTimes } = require('@fortawesome/free-solid-svg-icons');
    const Button = require('~/components/button/Button').default;

    return (
        <div className={styles.actions}>
            <Button
                variant="primary"
                leftIcon={faCheck}
                onClick={onAccept}
            >
                Chấp nhận
            </Button>
            <Button
                variant="danger"
                leftIcon={faTimes}
                onClick={onReject}
            >
                Từ chối
            </Button>
        </div>
    );
}

export default RequestCard;
