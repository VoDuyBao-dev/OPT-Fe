import RequestCard from '../requestCard/RequestCard';
import styles from './RequestList.module.scss';

function RequestList({ requests, onAccept, onReject }) {
    if (requests.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Không có yêu cầu nào phù hợp với bộ lọc.</p>
            </div>
        );
    }

    return (
        <div className={styles.requestList}>
            {requests.map(request => (
                <RequestCard
                    key={request.id}
                    request={request}
                    onAccept={onAccept}
                    onReject={onReject}
                />
            ))}
        </div>
    );
}

export default RequestList;
