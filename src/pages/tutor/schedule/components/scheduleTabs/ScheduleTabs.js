import styles from './ScheduleTabs.module.scss';

function ScheduleTabs({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'availability', label: 'Lịch rảnh của bạn', icon: '📅' },
        { id: 'schedule', label: 'Lịch dạy', icon: '📚' }
    ];

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {/* <span className={styles.icon}>{tab.icon}</span> */}
                        <span className={styles.label}>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className={styles.indicator} data-active={activeTab} />
        </div>
    );
}

export default ScheduleTabs;
