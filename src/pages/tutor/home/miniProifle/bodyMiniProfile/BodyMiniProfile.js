import avt from "~/assets/imgs/img.jpg";
import styles from "./BodyMiniProfile.module.scss";
import { Grid } from "@mui/material";

function BodyMiniProfile({ tutorData = null }) {
    // Use provided tutorData or fallback to default
    const userData = tutorData || {
        fullName: "Đang tải...",
        email: "N/A",
        gender: "N/A",
        phoneNumber: "N/A",
        address: "N/A",
        subjects: "N/A",
        educationalLevel: "N/A",
        certificates: "N/A",
        introduction: "Đang tải thông tin gia sư...",
        avatarUrl: avt,
    };




    return ( 
        <Grid container className={styles.bodyMiniProfile}>
            <Grid item size={{ xs: 12, sm: 3, md: 3, lg: 2.5 }} className={styles.avatarContainer}>
                <div className={styles.avatarBox}>
                    <img src={userData.avatarUrl || avt} alt="ảnh đại diện"/>
                </div>
            </Grid>
            <Grid item size={{ xs: 12, sm: 9, md: 9, lg: 9.5 }} className={styles.infoContainer}>
                <ul className={styles.infoList}>
                    <li>
                        <strong>Họ và tên:</strong>
                        <span>{userData.fullName}</span>
                    </li>
                    <li>
                        <strong>Email:</strong>
                        <span>{userData.email}</span>
                    </li>
                    <li>
                        <strong>Giới tính:</strong>
                        <span>{userData.gender}</span>
                    </li>
                    <li>
                        <strong>Số điện thoại:</strong>
                        <span>{userData.phoneNumber}</span>
                    </li>
                    <li>
                        <strong>Địa chỉ:</strong>
                        <span>{userData.address}</span>
                    </li>
                    <li>
                        <strong>Môn dạy:</strong>
                        <span>{Array.isArray(userData.subjects) ? userData.subjects.join(', ') : userData.subjects}</span>
                    </li>
                    <li>
                        <strong>Trình độ:</strong>
                        <span>{userData.educationalLevel}</span>
                    </li>
                    <li>
                        <strong>Chứng chỉ:</strong>
                        <span>{`${userData.certificates.length} chứng chỉ` || 'Không'}</span>
                    </li>
                    <li className={styles.introduction}>
                        <strong>Giới thiệu:</strong>
                        <span>{userData.introduction}</span>
                    </li>
                </ul>
            </Grid>
        </Grid>
     );
}

export default BodyMiniProfile;