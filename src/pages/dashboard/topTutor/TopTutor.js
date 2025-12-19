import TopTutorHead from './topTutorHead/TopTutorHead';
import TopTutorBody from './topTutorBody/TopTutorBody';
import styles from './TopTutor.module.scss';
import Button from '~/components/button/Button';
import { Link } from 'react-router-dom';

function TopTutor() {
    return (
        <section className={styles.topTutor}>
            <div className={styles.topTutorContainer}>
                <TopTutorHead />
                <TopTutorBody />
                <div className={styles.buttonWrapper}>
                    <Link to="/tutor">
                        <Button variant="primary" size="medium">Xem tất cả gia sư</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default TopTutor;
