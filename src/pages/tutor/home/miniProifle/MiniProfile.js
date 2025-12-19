// src/components/MiniProfile/MiniProfile.jsx

import clsx from "clsx";
import { useState, useEffect } from "react";
import HeaderMiniProfile from "./headerMiniProfile/HeaderMiniProfile";
import BodyMiniProfile from "./bodyMiniProfile/BodyMiniProfile";
import styles from "./MiniProfile.module.scss";
import { getTutorInfo } from '~/api/services/tutorService';

function MiniProfile({ className }) {
    const [tutorData, setTutorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutorData = async () => {
            try {
                setLoading(true);

                // ✅ Gọi API mà không cần tutorId (backend lấy từ JWT token)
                const tutorInfo = await getTutorInfo();

                setTutorData(tutorInfo);
                setError(null);
            } catch (err) {
                setError(err.message || 'Lỗi khi tải dữ liệu gia sư');
            } finally {
                setLoading(false);
            }
        };

        fetchTutorData();
    }, []);

    if (loading) {
        return (
            <div className={clsx(styles.miniProfile, className)}>
                <div className={styles.miniProfileCtn}>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={clsx(styles.miniProfile, className)}>
                <div className={styles.miniProfileCtn}>
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }
    return (
        <div className={clsx(styles.miniProfile, className)}>
            <div className={styles.miniProfileCtn}>
                {/* ✅ Truyền rating từ tutorData */}
                <HeaderMiniProfile rating={tutorData?.averageRating || 0} />
                <BodyMiniProfile tutorData={tutorData} />
            </div>
        </div>
    );
}

export default MiniProfile;