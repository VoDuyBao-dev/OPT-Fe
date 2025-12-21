import { useEffect, useMemo, useState } from 'react';
import EBookCard from '~/components/e-Books-Card/E-Book-Card';
import { getFeaturedEbooks } from '~/api/services/homeService';
import styles from './E-BooksDB-Body.module.scss';
import { getUserType } from '~/utils/auth';

function EBooksDBBody({ disableActions }) {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const isTutorOrAdmin = useMemo(() => {
        if (disableActions) return true;
        const role = getUserType();
        return role === 'tutor' || role === 'admin';
    }, [disableActions]);

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
                    disableNavigation={isTutorOrAdmin}
                />
            ))}
        </div>
    );
}

export default EBooksDBBody;
