import FormGroup from '~/components/formGroup/FormGroup';
import { faGraduationCap, faFileAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './EducationTab.module.scss';
import Button from '~/components/button/Button';

function EducationTab({
    formData,
    isEditing,
    onChange,
    certificates = [],
    onAddCertificate,
    onCertificateNameChange,
    onCertificateFileChange,
    onRemoveCertificate,
}) {
    const visibleCertificates = certificates
        .map((c, idx) => ({ ...c, _origIdx: idx }))
        .filter(c => !c.deleted);

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Học vấn & Chứng chỉ</h2>

            <div className={styles.formGrid}>
                <div className={styles.fullWidth}>
                    <FormGroup
                        label="Trường đại học"
                        icon={faGraduationCap}
                        name="university"
                        value={formData.university}
                        onChange={onChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className={styles.fullWidth}>
                    <FormGroup
                        label="Giới thiệu bản thân"
                        name="introduction"
                        type="textarea"
                        value={formData.introduction}
                        onChange={onChange}
                        disabled={!isEditing}
                        rows={5}
                    />
                </div>
                <FormGroup
                    label="Học phí (VNĐ/giờ)"
                    name="pricePerHour"
                    type="number"
                    value={formData.pricePerHour}
                    onChange={onChange}
                    disabled={!isEditing}
                />
            </div>

            <div className={styles.proofFile}>
                <h3>Chứng chỉ & Bằng cấp <span>{isEditing ? "(Lưu ý: Không thêm file mới vào nếu không có thay đổi)" : ""}</span></h3>
                <p className={styles.reviewNote}>Nếu upload file mới, admin sẽ duyệt lại.</p>
                <div className={styles.certList}>
                    {visibleCertificates.length === 0 && <p className={styles.empty}>Chưa có chứng chỉ</p>}
                    {visibleCertificates.map((cert) => (
                        <div key={cert.id || cert._origIdx} className={styles.certRow}>
                            <div className={styles.certInfo}>
                                <FormGroup
                                    label="Tên chứng chỉ"
                                    placeholder='Ví dụ: Bằng cử nhân Toán học'
                                    icon={faFileAlt}
                                    name={`certificate-${cert._origIdx}`}
                                    value={cert.name}
                                    onChange={(e) => onCertificateNameChange(cert._origIdx, e.target.value)}
                                    disabled={!isEditing}
                                    required
                                    className={styles.formGroup}
                                />
                                {cert.status && (
                                    <span
                                        className={`${styles.certStatus} ${cert.status === 'PENDING' ? styles.pending : styles.approved}`}
                                    >
                                        {cert.status === 'PENDING' ? 'Chờ duyệt' : cert.status}
                                    </span>
                                )}
                                {cert.fileUrl && !cert.file && (
                                    <Button
                                        size="small"
                                        type="button"
                                        variant="link"
                                        target="_blank"
                                        rel="noreferrer"
                                        className={styles.certLinkBtn}
                                    >
                                        <a href={cert.fileUrl} target="_blank" rel="noreferrer" className={styles.certLink}>
                                            Xem file hiện tại
                                        </a>
                                    </Button>
                                )}
                            </div>
                            {isEditing && (
                                <div className={styles.certActions}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => onCertificateFileChange(cert._origIdx, e.target.files?.[0] || null)}
                                        className={styles.fileInput}
                                    />
                                    <Button
                                        type="button"
                                        size="small"
                                        className={styles.removeCertBtn}
                                        onClick={() => onRemoveCertificate(cert._origIdx)}
                                        title="Xóa chứng chỉ"
                                        variant="danger"
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> Xóa chứng chỉ
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {isEditing && (
                    <Button 
                        type="button" 
                        className={styles.addCertBtn} 
                        onClick={onAddCertificate}
                        variant="primary"
                        size= 'small'
                    >
                        <FontAwesomeIcon icon={faPlus} /> Thêm chứng chỉ
                    </Button>
                )}
            </div>
        </div>
    );
}

export default EducationTab;
