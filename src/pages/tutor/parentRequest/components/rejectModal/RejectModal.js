import Button from '~/components/button/Button';
import styles from './RejectModal.module.scss';

function RejectModal({ isOpen, onClose, onConfirm, reason, onReasonChange }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>Từ chối yêu cầu</h2>
                <p>Vui lòng cho biết lý do từ chối yêu cầu này:</p>
                <textarea
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    rows={4}
                />
                <div className={styles.modalActions}>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={onConfirm}
                        disabled={!reason.trim()}
                    >
                        Xác nhận từ chối
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default RejectModal;
