// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.scss";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { getDashboard } from "../../../api/services/adminDashboard";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [ebookData, setEbookData] = useState(null);
  const [topRequestedSubjectsData, setTopRequestedSubjectsData] = useState(null);
  const [tutorVerificationData, setTutorVerificationData] = useState(null);
  const [topTutorSubjectsData, setTopTutorSubjectsData] = useState(null);
  const [ratingDistributionData, setRatingDistributionData] = useState(null);
  const [requestStatusData, setRequestStatusData] = useState(null);


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getDashboard();
        if (!res) return;

        // ============== 1. Tổng quan ==============
        const ov = res.overview;

        setStats([
          { title: "Tổng số học viên", value: ov.totalLearners, color: "#4CAF50" },
          { title: "Tổng số gia sư", value: ov.totalTutors, color: "#2196F3" },
          { title: "Tổng số yêu cầu học", value: ov.totalClassRequests, color: "#FF9800" },
          { title: "Tổng số Ebook", value: ov.totalEbooks, color: "#9C27B0" },
        ]);

        // ============== 2. Ebook theo loại ==============
        const e = res.ebookStats;

        setEbookData({
          labels: ["Sách giáo khoa", "Tài liệu", "Đề thi tham khảo"],
          datasets: [
            {
              data: [
                e.SACH_GIAO_KHOA,
                e.TAI_LIEU,
                e.DE_THI_THAM_KHAO,
              ],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        });

        // ============== 3. Top Môn học được yêu cầu nhiều nhất ==============
        const topSub = res.topRequestedSubjects;

        setTopRequestedSubjectsData({
          labels: topSub.map((s) => s.subjectName),
          datasets: [
            {
              label: "Số lượng yêu cầu",
              data: topSub.map((s) => s.count),
              backgroundColor: ["#36A2EB"],
              borderRadius: 8,
            },
          ],
        });

        // ============== 4. Trạng thái xác minh gia sư ==============
        const verify = res.tutorVerification;

        setTutorVerificationData({
          labels: ["Đã duyệt", "Chờ duyệt"],
          datasets: [
            {
              label: "Gia sư",
              data: [verify.approved, verify.pending],
              backgroundColor: ["#4CAF50", "#FFC107"],
            },
          ],
        });

        // ============== 5. Top môn học có nhiều gia sư dạy ==============
        const topTutorSubjects = res.topSubjectsByTutor;

        setTopTutorSubjectsData({
          labels: topTutorSubjects.map(s => s.subjectName),
          datasets: [
            {
              label: "Số gia sư",
              data: topTutorSubjects.map(s => s.count),
              backgroundColor: "#4CAF50",
              borderRadius: 8,
            },
          ],
        });

        // ============== 6. Phân bố đánh giá ==============
        const rating = res.ratingDistribution;

        setRatingDistributionData({
          labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
          datasets: [
            {
              label: "Số lượng đánh giá",
              data: [
                rating[1],
                rating[2],
                rating[3],
                rating[4],
                rating[5],
              ],
              backgroundColor: "#2196F3",
              borderRadius: 8,
            },
          ],
        });

        // ============== 7. Phân bố trạng thái yêu cầu ==============
        const req = res.requestStatusDistribution;

        setRequestStatusData({
          labels: ["Chờ xử lý", "Đã xác nhận", "Đã hủy"],
          datasets: [
            {
              data: [req.PENDING, req.CONFIRMED, req.CANCELLED],
              backgroundColor: ["#FFC107", "#4CAF50", "#F44336"],
            },
          ],
        });


      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className={styles.dashboard}>

      {/* Tổng quan */}
      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.card} style={{ borderTopColor: stat.color }}>
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Biểu đồ */}
      <div className={styles.charts}>
        <div className={styles.chart}>
          <h3>Ebook theo loại</h3>
          {ebookData && <Pie data={ebookData} />}
        </div>

        <div className={styles.chart}>
          <h3>Top môn học được yêu cầu nhiều nhất</h3>
          {topRequestedSubjectsData && <Bar data={topRequestedSubjectsData} />}
        </div>

        <div className={styles.chart}>
          <h3>Trạng thái xác minh gia sư</h3>
          {tutorVerificationData && <Doughnut data={tutorVerificationData} />}
        </div>

        <div className={`${styles.chart} ${styles.analyticsChart}`}>
          <h3 className={styles.chartTitleGreen}>
            Top 5 môn học có nhiều gia sư nhất
          </h3>
          {topTutorSubjectsData && <Bar data={topTutorSubjectsData} />}
        </div>

        <div className={`${styles.chart} ${styles.analyticsChart}`}>
          <h3 className={styles.chartTitleBlue}>
            Phân bố rating gia sư
          </h3>
          {ratingDistributionData && <Bar data={ratingDistributionData} />}
        </div>

        <div className={`${styles.chart} ${styles.analyticsChart}`}>
          <h3 className={styles.chartTitleOrange}>
            Trạng thái yêu cầu học
          </h3>
          {requestStatusData && <Doughnut data={requestStatusData} />}
        </div>


      </div>

    </div>
  );
};

export default AdminDashboard;
