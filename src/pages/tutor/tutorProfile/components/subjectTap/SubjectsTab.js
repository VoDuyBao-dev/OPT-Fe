import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './SubjectsTab.module.scss';

function SubjectsTab({
    subjects,
    availability,
    isEditing = false,
    onAddSubject = () => {},
    onRemoveSubject = () => {},
    availableSubjects = [],
}) {
    const [selectedSubject, setSelectedSubject] = useState('');

    const handleAdd = () => {
        if (!selectedSubject) return;
        onAddSubject(selectedSubject);
        setSelectedSubject('');
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Môn học giảng dạy</h2>

            {isEditing && (
                <div className={styles.controls}>
                    <select
                        className={styles.select}
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="">Chọn môn học</option>
                        {availableSubjects.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <button type="button" className={styles.addBtn} onClick={handleAdd}>
                        Thêm môn
                    </button>
                </div>
            )}

            <div className={styles.subjectsList}>
                {subjects.length === 0 && <p className={styles.empty}>Chưa chọn môn nào</p>}
                {subjects.map(subject => (
                    <div key={subject.id} className={styles.subjectCard}>
                        <FontAwesomeIcon icon={faBook} />
                        <div>
                            <h4>{subject.name}</h4>
                            <span>{subject.grade}</span>
                        </div>
                        {isEditing && (
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => onRemoveSubject(subject.id)}
                                title="Xóa môn học"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* <h2 className={styles.sectionTitle}>Lịch rảnh</h2>
            <div className={styles.availabilityList}>
                {availability.map((slot, index) => (
                    <div key={index} className={styles.availabilityCard}>
                        <strong>{slot.dayOfWeek}</strong>
                        <span>{slot.startTime} - {slot.endTime}</span>
                        <span className={styles.statusBadge}>{slot.status}</span>
                    </div>
                ))}
            </div> */}
        </div>
    );
}

export default SubjectsTab;
