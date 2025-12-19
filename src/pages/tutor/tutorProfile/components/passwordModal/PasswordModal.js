import { useState, useEffect } from 'react';
import FormGroup from '~/components/formGroup/FormGroup';
import Button from '~/components/button/Button';
import { faLock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './PasswordModal.module.scss';

function PasswordModal({ isOpen, onClose }) {
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        let isValid = true;

        // Validate old password
        if (!passwordData.oldPassword.trim()) {
            newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
            isValid = false;
        }

        // Validate new password
        if (!passwordData.newPassword.trim()) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
            isValid = false;
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        } else if (passwordData.newPassword === passwordData.oldPassword) {
            newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
            isValid = false;
        }

        // Validate confirm password
        if (!passwordData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
            isValid = false;
        } else if (passwordData.confirmPassword !== passwordData.newPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePasswordSubmit = () => {
        if (!validateForm()) {
            return;
        }
        // TODO: Call API to change password
        alert('Đổi mật khẩu thành công!');
        handleClose();
    };

    const handleClose = () => {
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({ oldPassword: '', newPassword: '', confirmPassword: '' });
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2>Đổi mật khẩu</h2>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.formField}>
                        <FormGroup
                            label="Mật khẩu hiện tại"
                            icon={faLock}
                            name="oldPassword"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        {errors.oldPassword && (
                            <span className={styles.errorMessage}>{errors.oldPassword}</span>
                        )}
                    </div>
                    
                    <div className={styles.formField}>
                        <FormGroup
                            label="Mật khẩu mới"
                            icon={faLock}
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        {errors.newPassword && (
                            <span className={styles.errorMessage}>{errors.newPassword}</span>
                        )}
                    </div>
                    
                    <div className={styles.formField}>
                        <FormGroup
                            label="Xác nhận mật khẩu mới"
                            icon={faLock}
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        {errors.confirmPassword && (
                            <span className={styles.errorMessage}>{errors.confirmPassword}</span>
                        )}
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handlePasswordSubmit}
                    >
                        Đổi mật khẩu
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PasswordModal;
