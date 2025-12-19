import styles from './E-BooksDB-Head.module.scss';

function EBooksDBHead() {


    return (
        <div className={styles.ebooksHead}>
            <div className={styles.textContent}>
                <h2 className={styles.title}>Tài liệu học tập</h2>
                <p className={styles.description}>
                    Khám phá thư viện tài liệu phong phú với hàng trăm e-book chất lượng cao, 
                    được tuyển chọn kỹ lưỡng để hỗ trợ quá trình học tập của bạn
                </p>
            </div>
        </div>
    );
}

export default EBooksDBHead;
