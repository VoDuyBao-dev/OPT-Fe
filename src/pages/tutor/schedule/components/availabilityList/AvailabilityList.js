import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/button/Button';
import styles from './AvailabilityList.module.scss';

function AvailabilityList({ availabilities, onAdd, onEdit, onDelete }) {
    const statusLabel = { AVAILABLE: 'Rảnh', CANCELLED: 'Không rảnh', BOOKED: 'Đã đặt' };
    const statusClass = {
        AVAILABLE: '',
        CANCELLED: styles.unavailable,
        BOOKED: styles.booked,
    };
    const groupedByDay = availabilities.reduce((acc, item, index) => {
        const day = item.dayOfWeek;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push({ ...item, index });
        return acc;
    }, {});

    const daysOrder = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    console.log('Grouped Availabilities:', availabilities);
    return (
        <div className={styles.availabilityList}>
            <div className={styles.header}>
                <h3>Lịch rảnh của bạn</h3>
                <Button 
                    variant="primary" 
                    size="small"
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={onAdd}
                >
                    Thêm lịch rảnh
                </Button>
            </div>

            {availabilities.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Chưa có lịch rảnh nào. Hãy thêm lịch rảnh của bạn!</p>
                    <Button 
                        variant="primary"
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={onAdd}
                    >
                        Thêm lịch rảnh đầu tiên
                    </Button>
                </div>
            ) : (
                <div className={styles.list}>
                    {daysOrder.map(day => {
                        const daySlots = groupedByDay[day];
                        if (!daySlots) return null;

                        return (
                            <div key={day} className={styles.dayGroup}>
                                <h4 className={styles.dayTitle}>{day}</h4>
                                <div className={styles.slots}>
                                    {daySlots.map(slot => (
                                        <div 
                                            key={slot.index} 
                                            className={`${styles.slotCard} ${statusClass[slot.status] || ''}`}
                                        >
                                            <div className={styles.slotInfo}>
                                                <span className={styles.time}>
                                                    {slot.startTime} - {slot.endTime}
                                                </span>
                                                <span className={`${styles.status} ${
                                                    slot.status === 'AVAILABLE' ? styles.available : ''
                                                }`}>
                                                    {statusLabel[slot.status] || slot.status}
                                                </span>
                                            </div>
                                            <div className={styles.actions}>
                                                <button 
                                                    className={styles.editBtn}
                                                    onClick={() => onEdit(slot.index)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button 
                                                    className={styles.deleteBtn}
                                                    onClick={() => onDelete(slot.index)}
                                                    title="Xóa"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AvailabilityList;
