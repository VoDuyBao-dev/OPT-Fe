import { faBell, faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import Grid from '@mui/material/Grid';
import BoxInfor from "./boxInfor/BoxInfor";
import MiniProfile from "./miniProifle/MiniProfile";
import styles from './TutorHome.module.scss';
import ListClasses from "./listClasses/ListClasses";
import { useEffect, useState } from 'react';
import { getWeeklyClassCount, getNewRequestsCount } from '~/api/services/tutorService';

function TutorHome() {
    const [weeklyCount, setWeeklyCount] = useState(0);
    const [newReqCount, setNewReqCount] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setError('');
                const [weekly, requests] = await Promise.all([
                    getWeeklyClassCount(),
                    getNewRequestsCount(),
                ]);
                setWeeklyCount(weekly ?? 0);
                setNewReqCount(requests ?? 0);
            } catch (e) {
                setError(e.response?.data?.message || e.message || 'Lỗi tải dữ liệu');
            }
        };
        load();
    }, []);

    return (
        <div className={styles.tutorHome}>
            <div className={styles.container}>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <section className={styles.section}>
                    <Grid container spacing={2} columns={12}>
                        <Grid item xs={12} size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
                            <MiniProfile />
                        </Grid>
                        <Grid item xs={12} size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                            <div className={styles.boxInfor}>
                                <Grid container spacing={2} columns={12} className={styles.gridBoxInfor}>
                                    <Grid item size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
                                        <BoxInfor
                                            type="primary"
                                            title="QUẢN LÝ LỊCH DẠY"
                                            quanity={weeklyCount}
                                            unit=" Buổi dạy / tuần"
                                            path="/tutor/schedule"
                                            icon={faCalendarDays}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
                                        <BoxInfor
                                            title="QUẢN LÝ YÊU CẦU"
                                            quanity={newReqCount}
                                            path="/tutor/parent-requests"
                                            icon={faBell}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>
                </section>
                <section className={styles.section}>
                    <ListClasses />
                </section>
            </div>
        </div>
    );
}

export default TutorHome;