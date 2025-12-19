import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/button/Button';
import ScheduleModal from '../scheduleModal/ScheduleModal';
import styles from './ConfirmDialog.module.scss';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <ScheduleModal
            isOpen={isOpen}
            onClose={onClose}
            title={title || "Xác nhận"}
        >
            <div className={styles.confirmDialog}>
                <div className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
                <p className={styles.message}>
                    {message || "Bạn có chắc chắn muốn thực hiện hành động này?"}
                </p>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleConfirm}>
                        Xác nhận
                    </Button>
                </div>
            </div>
        </ScheduleModal>
    );
}

export default ConfirmDialog;
