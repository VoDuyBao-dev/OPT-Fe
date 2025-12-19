import ListLearner from './listLearner/ListLearner';
import styles from './LearnerManagement.module.scss';
import HeaderPage from '~/components/headerPage/HeaderPage';

function LearnerManagement() {
    return (
        <div className={styles.learnerManagement}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <HeaderPage title="Quản lý Người học" />
                </div>
                <div className={styles.content}>
                    <ListLearner />
                </div>
            </div>
        </div>
    );
}

export default LearnerManagement;
