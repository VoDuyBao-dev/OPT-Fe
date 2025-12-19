import { useState, useEffect } from 'react';
import ScheduleModal from '../scheduleModal/ScheduleModal';
import FormGroup from '~/components/formGroup/FormGroup';
import Button from '~/components/button/Button';
import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './AvailabilityModal.module.scss';

function AvailabilityModal({ isOpen, onClose, onSave, editData, existingAvailabilities = [] }) {
    const [formData, setFormData] = useState({
        dayOfWeek: '',
        timeSlot: '',
        status: 'AVAILABLE'
    });

    const [errors, setErrors] = useState({
        dayOfWeek: '',
        timeSlot: ''
    });

    const daysOfWeek = [
        { value: 'Thứ 2', label: 'Thứ 2' },
        { value: 'Thứ 3', label: 'Thứ 3' },
        { value: 'Thứ 4', label: 'Thứ 4' },
        { value: 'Thứ 5', label: 'Thứ 5' },
        { value: 'Thứ 6', label: 'Thứ 6' },
        { value: 'Thứ 7', label: 'Thứ 7' },
        { value: 'Chủ nhật', label: 'Chủ nhật' }
    ];

    const timeSlots = [
        { value: '08:00-09:30', label: '8:00 - 9:30', startTime: '08:00', endTime: '09:30' },
        { value: '09:30-11:00', label: '9:30 - 11:00', startTime: '09:30', endTime: '11:00' },
        { value: '13:00-14:30', label: '13:00 - 14:30', startTime: '13:00', endTime: '14:30' },
        { value: '14:30-16:00', label: '14:30 - 16:00', startTime: '14:30', endTime: '16:00' },
        { value: '17:00-18:30', label: '17:00 - 18:30', startTime: '17:00', endTime: '18:30' },
        { value: '18:30-20:00', label: '18:30 - 20:00', startTime: '18:30', endTime: '20:00' }
    ];

    useEffect(() => {
        if (editData) {
            // Convert startTime-endTime to timeSlot format
            const timeSlotValue = `${editData.startTime}-${editData.endTime}`;
            setFormData({
                dayOfWeek: editData.dayOfWeek,
                timeSlot: timeSlotValue,
                status: editData.status || 'AVAILABLE'
            });
        } else {
            setFormData({
                dayOfWeek: '',
                timeSlot: '',
                status: 'AVAILABLE'
            });
        }
        setErrors({
            dayOfWeek: '',
            timeSlot: ''
        });
    }, [editData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = () => {
        const newErrors = {
            dayOfWeek: '',
            timeSlot: ''
        };

        let hasError = false;

        if (!formData.dayOfWeek) {
            newErrors.dayOfWeek = 'Vui lòng chọn thứ trong tuần';
            hasError = true;
        }

        if (!formData.timeSlot) {
            newErrors.timeSlot = 'Vui lòng chọn khung giờ';
            hasError = true;
        }

        // Check for overlapping time slots on the same day
        if (!hasError && formData.dayOfWeek && formData.timeSlot) {
            const currentIndex = editData?.index;
            const overlappingSlot = existingAvailabilities.find((slot, index) => {
                // Skip checking against itself when editing
                if (currentIndex !== undefined && index === currentIndex) {
                    return false;
                }
                
                // Check if same day and same time slot
                const currentTimeSlot = `${slot.startTime}-${slot.endTime}`;
                if (slot.dayOfWeek === formData.dayOfWeek && currentTimeSlot === formData.timeSlot) {
                    return true;
                }
                return false;
            });

            if (overlappingSlot) {
                newErrors.timeSlot = `Khung giờ này đã được thêm cho ${formData.dayOfWeek}`;
                hasError = true;
            }
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        // Parse timeSlot to get startTime and endTime
        const selectedSlot = timeSlots.find(slot => slot.value === formData.timeSlot);
        const dataToSave = {
            dayOfWeek: formData.dayOfWeek,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            status: formData.status
        };

        onSave(dataToSave);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            dayOfWeek: '',
            timeSlot: '',
            status: 'AVAILABLE'
        });
        setErrors({
            dayOfWeek: '',
            timeSlot: ''
        });
        onClose();
    };

    return (
        <ScheduleModal
            isOpen={isOpen}
            onClose={handleClose}
            title={editData ? "Chỉnh sửa lịch rảnh" : "Thêm lịch rảnh"}
        >
            <div className={styles.availabilityForm}>
                <FormGroup
                    label="Thứ trong tuần"
                    icon={faCalendar}
                    name="dayOfWeek"
                    type="select"
                    value={formData.dayOfWeek}
                    onChange={handleChange}
                    options={daysOfWeek}
                    placeholder="Chọn thứ"
                    required
                />
                {errors.dayOfWeek && (
                    <div className={styles.errorMessage}>{errors.dayOfWeek}</div>
                )}

                <FormGroup
                    label="Khung giờ học"
                    icon={faClock}
                    name="timeSlot"
                    type="select"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    options={timeSlots}
                    placeholder="Chọn khung giờ"
                    required
                />
                {errors.timeSlot && (
                    <div className={styles.errorMessage}>{errors.timeSlot}</div>
                )}

                <FormGroup
                    label="Trạng thái"
                    name="status"
                    type="select"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                        { value: 'AVAILABLE', label: 'Rảnh' },
                        { value: 'CANCELLED', label: 'Không rảnh' }
                    ]}
                />

                <div className={styles.modalActions}>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editData ? 'Cập nhật' : 'Thêm lịch'}
                    </Button>
                    <Button variant="outline" onClick={handleClose}>
                        Hủy
                    </Button>
                </div>
            </div>
        </ScheduleModal>
    );
}

export default AvailabilityModal;
