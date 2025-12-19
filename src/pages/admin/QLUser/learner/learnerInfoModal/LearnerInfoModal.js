import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '~/components/formGroup/FormGroup';
import styles from './LearnerInfoModal.module.scss';

function LearnerInfoModal({ isOpen, onClose, learnerData = null, isLoading = false }) {
    const handleClose = () => {
        onClose();
    };

    const displayData = {
        fullName: learnerData?.fullName || learnerData?.full_name || '',
        email: learnerData?.email || '',
        phone: learnerData?.phone || learnerData?.phone_number || '',
        address: learnerData?.address || '',
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Thông tin người học</h2>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form className={styles.modalBody}>
                    {isLoading ? (
                        <div className={styles.loadingMessage}>Đang tải thông tin...</div>
                    ) : learnerData ? (
                        <div className={styles.formGrid}>
                            <FormGroup
                                className={styles.inputField}
                                label="Họ và tên"
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Nhập họ và tên"
                                value={displayData.fullName}
                                disabled={true}
                            />
                            <FormGroup
                                className={styles.inputField}
                                label="Email"
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Nhập email"
                                value={displayData.email}
                                disabled={true}
                            />
                            <FormGroup
                                className={styles.inputField}
                                label="Số điện thoại"
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Nhập số điện thoại"
                                value={displayData.phone}
                                disabled={true}
                            />
                            <FormGroup
                                className={styles.inputField}
                                label="Địa chỉ"
                                type="text"
                                id="address"
                                name="address"
                                value={displayData.address}
                                disabled={true}
                            />
                        </div>
                    ) : (
                        <div className={styles.loadingMessage}>Không tìm thấy thông tin người học</div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default LearnerInfoModal;
