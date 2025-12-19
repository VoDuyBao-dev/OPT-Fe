import { useEffect, useState } from 'react';
import TutorCard from '~/components/tutorCard/TutorCard';
import { getFeaturedTutors } from '~/api/services/homeService';
import styles from './TopTutorBody.module.scss';

function TopTutorBody() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getFeaturedTutors();
                const mapped = (data || []).map((t) => ({
                    id: t.tutorId || t.id,
                    image: t.avatarUrl || t.imageUrl,
                    isVerified: t.verified ?? true,
                    name: t.fullName || t.name,
                    subject: (t.subjects && t.subjects[0]) || t.subject || '—',
                    rating: t.averageRating ?? t.rating ?? 0,
                    reviewCount: t.reviewCount ?? t.totalReviews ?? t.totalRatings ?? 0,
                    location: t.address || t.city || '',
                    price: t.pricePerHour
                        ? `${Number(t.pricePerHour).toLocaleString('vi-VN')}đ/giờ`
                        : '',
                }));
                setTutors(mapped);
            } catch (e) {
                console.error('Load featured tutors failed', e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) return <div className={styles.topTutorBody}>Đang tải...</div>;

    return (
        <div className={styles.topTutorBody}>
            {tutors.map((tutor) => (
                <TutorCard
                    key={tutor.id}
                    id={tutor.id}
                    image={tutor.image}
                    isVerified={tutor.isVerified}
                    name={tutor.name}
                    subject={tutor.subject}
                    rating={tutor.rating}
                    reviewCount={tutor.reviewCount}
                    location={tutor.location}
                    price={tutor.price}
                />
            ))}
        </div>
    );
}

export default TopTutorBody;
