import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/button/Button';
import AvatarSection from './avataSection/AvatarSection';
import styles from './AdminProfile.module.scss';
import InforSection from './inforSection/InforSection';
import { fetchAdminProfile, updateAdminProfile } from '~/api/services/adminProfileService';

function AdminProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const [adminData, setAdminData] = useState(null);
    const [editData, setEditData] = useState({ fullName: '', phone: '' });

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetchAdminProfile();
                const data = res.data.result;
                const mapped = {
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phoneNumber,
                    role: data.roleLabel || data.role,
                    avatar: data.avatarUrl,
                    createdAt: data.createdAt,
                };
                setAdminData(mapped);
                setEditData({ fullName: mapped.fullName, phone: mapped.phone });
            } catch (err) {
                setError(err?.response?.data?.message || 'Không tải được hồ sơ');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleEdit = () => {
        if (adminData) {
            setEditData({ fullName: adminData.fullName, phone: adminData.phone });
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (adminData) {
            setEditData({ fullName: adminData.fullName, phone: adminData.phone });
        }
        setIsEditing(false);
        if (avatarPreview && typeof avatarPreview === 'string' && avatarPreview.startsWith('blob:')) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview(null);
        setAvatarFile(null);
    };

    const handleSave = async () => {
        try {
            await updateAdminProfile({ fullName: editData.fullName, phoneNumber: editData.phone });

            setAdminData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    fullName: editData.fullName,
                    phone: editData.phone,
                    avatar: prev.avatar,
                };
            });
            setIsEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);
            setShowNotification(true);
        } catch (err) {
            console.error('Error saving profile:', err);
            alert(err?.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'avatar' && files?.[0]) {
            const file = files[0];
            
            // Lưu file object để upload sau
            setAvatarFile(file);
            
            // Cleanup preview cũ
            if (avatarPreview && typeof avatarPreview === 'string' && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
            
            // Tạo preview URL mới
            setAvatarPreview(URL.createObjectURL(file));
            return;
        }

        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.adminProfile}>Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.adminProfile}>{error}</div>
            </div>
        );
    }

    if (!adminData) return null;

    return (
        <div className={styles.container}>
            <div className={styles.adminProfile}>
                {showNotification && (
                    <div className={styles.notification}>
                        <FontAwesomeIcon icon={faCheckCircle} className={styles.notificationIcon} />
                        <span>Đã cập nhật thông tin thành công!</span>
                    </div>
                )}
                <div className={styles.header}>
                    <h1 className={styles.title}>Thông tin cá nhân</h1>
                    {!isEditing ? (
                        <Button variant="primary" onClick={handleEdit}>
                            <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                        </Button>
                    ) : (
                        <div className={styles.actions}>
                            <Button variant="primary" onClick={handleSave}>
                                <FontAwesomeIcon icon={faSave} /> Lưu
                            </Button>
                            <Button variant="outline" onClick={handleCancel}>
                                <FontAwesomeIcon icon={faTimes} /> Hủy
                            </Button>
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    <AvatarSection
                        onChange={handleChange}
                        onClick={handleAvatarClick}
                        fileInputRef={fileInputRef}
                        avatarPreview={avatarPreview}
                        adminData={adminData}
                        isEditing={isEditing}
                        editData={editData}
                    /> 

                    <InforSection
                        adminData={adminData}
                        isEditing={isEditing}
                        editData={editData}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
