import { useEffect, useState } from 'react';
import EBookCard from '~/components/e-Books-Card/E-Book-Card';
import { getFeaturedEbooks } from '~/api/services/homeService';
import styles from './E-BooksDB-Body.module.scss';

function EBooksDBBody() {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getFeaturedEbooks();
                const mapped = (data || []).map((e, idx) => ({
                    id: e.ebookId || e.id || idx,
                    cover: e.coverUrl || e.imageUrl || '',
                    title: e.title,
                    author: e.uploadedByName || e.author,
                    category: e.type || e.category,
                    description: e.description,
                    downloadUrl: e.filePath || e.downloadUrl,
                }));
                setEbooks(mapped);
            } catch (err) {
                console.error('Load ebooks failed', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) return <div className={styles.ebooksBody}>Đang tải...</div>;
    return (
        <div className={styles.ebooksBody}>
            {ebooks.map((ebook) => (
                <EBookCard
                    key={ebook.id}
                    id={ebook.id}
                    cover={ebook.cover}
                    title={ebook.title}
                    author={ebook.author}
                    category={ebook.category}
                    description={ebook.description}
                    downloadUrl={ebook.downloadUrl}
                />
            ))}
        </div>
    );
}

export default EBooksDBBody;
