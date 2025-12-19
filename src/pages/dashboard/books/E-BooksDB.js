import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import EBooksDBHead from './E-BooksDB-Head/E-BooksDB-Head';
import EBooksDBBody from './E-BooksDB-Body/E-BooksDB-Body';
import styles from './E-BooksDB.module.scss';
import Button from '~/components/button/Button';


function EBooksDB() {
    const navigate = useNavigate();

    const handleViewAll = () => {
        navigate('/EBooks');
    };
    return (
        <section className={styles.ebooks}>
            <div className={styles.ebooksContainer}>
                <EBooksDBHead />
                <EBooksDBBody />
                <div className={styles.buttonWrapper}>
                    <Button
                        variant="outline"
                        size="medium"
                        rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
                        onClick={handleViewAll}
                    >
                        Xem tất cả
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default EBooksDB;
