import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '~/components/formGroup/FormGroup';
import styles from './TutorInfoModal.module.scss';

function TutorInfoModal({ isOpen, onClose, tutorData = null, isLoading = false }) {
    if (!isOpen) return null;

    const displayData = {
        fullName: tutorData?.fullName || tutorData?.full_name || '',
        gender: tutorData?.gender || '',
        email: tutorData?.email || '',
        phone: tutorData?.phone || tutorData?.phone_number || '',
        address: tutorData?.address || '',
        subjects: tutorData?.subjects || [],
        currentLevel: tutorData?.currentLevel || tutorData?.educational_level || '',
        // certifications is normalized in ListTutor -> handleViewDetail
        certifications: Array.isArray(tutorData?.certifications) ? tutorData.certifications : [],
        introduction: tutorData?.introduction || '',
        pricePerHour: tutorData?.pricePerHour || tutorData?.price_per_hour || '',
        university: tutorData?.university || '',
        status: tutorData?.status || '',
        rating: tutorData?.rating || tutorData?.average_rating || 0,
    };

    const certList = Array.isArray(displayData.certifications) ? displayData.certifications : [];

    const handleClose = () => {
        onClose();
    };
    console.log('TutorInfoModal tutorData:', tutorData);    
    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Thông tin gia sư</h2>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {isLoading ? (
                        <div className={styles.loadingMessage}>Đang tải thông tin...</div>
                    ) : tutorData ? (
                        <>
                            <div className={styles.formGrid}>
                                <FormGroup
                                    className={styles.inputField}
                                    label="Họ và tên"
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={displayData.fullName}
                                    disabled={true}
                                />
                                <FormGroup
                                    className={styles.inputField}
                                    label="Giới tính"
                                    type="text"
                                    id="gender"
                                    name="gender"
                                    value={displayData.gender}
                                    disabled={true}
                                />
                                <FormGroup
                                    className={styles.inputField}
                                    label="Email"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={displayData.email}
                                    disabled={true}
                                />
                                <FormGroup
                                    className={styles.inputField}
                                    label="Số điện thoại"
                                    type="tel"
                                    id="phone"
                                    name="phone"
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
                                <FormGroup
                                    className={styles.inputField}
                                    label="Trình độ"
                                    type="text"
                                    id="currentLevel"
                                    name="currentLevel"
                                    value={displayData.currentLevel}
                                    disabled={true}
                                />
                                <FormGroup
                                    className={styles.inputField}
                                    label="Trường đào tạo"
                                    type="text"
                                    id="university"
                                    name="university"
                                    value={displayData.university}
                                    disabled={true}
                                />
                                <FormGroup
                                    className={styles.inputField}
                                    label="Học phí (VND/giờ)"
                                    type="text"
                                    id="pricePerHour"
                                    name="pricePerHour"
                                    value={displayData.pricePerHour?.toLocaleString?.('vi-VN') || displayData.pricePerHour}
                                    disabled={true}
                                />
                                <FormGroup
                                    className={styles.inputField}
                                    label="Đánh giá trung bình"
                                    type="text"
                                    id="rating"
                                    name="rating"
                                    value={Number(displayData.rating || 0).toFixed(1)}
                                    disabled={true}
                                />
                                <FormGroup
                                    className={styles.inputField}
                                    label="Trạng thái"
                                    type="text"
                                    id="status"
                                    name="status"
                                    value={displayData.status}
                                    disabled={true}
                                />
                            </div>

                            <div className={styles.sectionBlock}>
                                <div className={styles.sectionTitle}>Môn dạy</div>
                                {displayData.subjects.length ? (
                                    <div className={styles.tags}>
                                        {displayData.subjects.map((s, idx) => (
                                            <span key={`subject-${idx}`} className={styles.tag}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.loadingMessage}>Không có thông tin môn dạy</div>
                                )}
                            </div>

                            <div className={styles.sectionBlock}>
                                <div className={styles.sectionTitle}>Chứng chỉ</div>
                                {certList.length > 0 ? (
                                    <div className={styles.certList}>
                                        {certList.map((cert, idx) => {
                                            const firstFile = cert?.files?.[0];
                                            const certName = cert?.name ?? `Chứng chỉ ${idx + 1}`;
                                            return (
                                                <div className={styles.certRow} key={`cert-${idx}`}>
                                                    <span className={styles.certName}>{certName}</span>
                                                    <button
                                                        className={styles.viewCertButton}
                                                        onClick={() => firstFile && window.open(firstFile, '_blank')}
                                                        disabled={!firstFile}
                                                    >
                                                        Xem file
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className={styles.loadingMessage}>Không có thông tin chứng chỉ</div>
                                )}
                            </div>

                            <FormGroup
                                className={styles.inputField}
                                label="Giới thiệu bản thân"
                                type="textarea"
                                id="introduction"
                                name="introduction"
                                value={displayData.introduction}
                                disabled={true}
                            />
                        </>
                    ) : (
                        <div className={styles.loadingMessage}>Không tìm thấy thông tin gia sư</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TutorInfoModal;
