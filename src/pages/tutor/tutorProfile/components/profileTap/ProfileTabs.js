import styles from './ProfileTabs.module.scss';

function ProfileTabs({ activeTab, onTabChange, isEditing }) {
    const tabs = [
        { id: 'info', label: 'Thông tin cá nhân' },
        { id: 'education', label: 'Học vấn & Giới thiệu' },
        { id: 'subjects', label: 'Môn học' }
    ];
    const handleTabClick = (tabId) => {
        if (!isEditing) {
            onTabChange(tabId);
        }else{
            alert('Vui lòng lưu thay đổi hoặc hủy các thay đổi trước khi chuyển tab.');
        }
    };

    return (
        <div className={styles.tabs}>
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => handleTabClick(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default ProfileTabs;
