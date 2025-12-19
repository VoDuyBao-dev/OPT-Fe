import ProgressTitle from './progressTitle/ProgressTitle';
import ProgressBody from './progressBody/ProgressBody';
import styles from './Progress.module.scss';

function Progress() {
    return (
        <section className={styles.progress}>
            <div className={styles.progressContainer}>
                <ProgressTitle />
                <ProgressBody />
            </div>
        </section>
    );
}

export default Progress;