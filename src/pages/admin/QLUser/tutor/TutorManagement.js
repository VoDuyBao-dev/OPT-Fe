 import { useState } from 'react';
import clsx from 'clsx';
import ListTutor from './listTutor/ListTutor';
import PendingApprovals from './pendingApprovals/PendingApprovals';
import styles from './TutorManagement.module.scss';
import HeaderPage from '~/components/headerPage/HeaderPage';

function TutorManagement() {
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'pending'

    return (
        <div className={styles.tutorManagement}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <HeaderPage title="Quản lý Gia sư" />
                    <div className={styles.tabNav}>
                        <button
                            className={clsx(styles.tabButton, { [styles.active]: activeTab === 'list' })}
                            onClick={() => setActiveTab('list')}
                        >
                            Danh sách Gia sư
                        </button>
                        <button
                            className={clsx(styles.tabButton, { [styles.active]: activeTab === 'pending' })}
                            onClick={() => setActiveTab('pending')}
                        >
                            Phê duyệt Hồ sơ
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {activeTab === 'list' ? <ListTutor /> : <PendingApprovals />}
                </div>
            </div>
        </div>
    );
}

export default TutorManagement;
