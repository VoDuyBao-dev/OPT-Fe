import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TutorDetail.scss";
import { FaStar } from "react-icons/fa";
import ClassCard from "~/components/Learner/Card/Card";
import TutorFormModal from "~/components/Learner/TutorModal/TutorModal";
import { getTutorDetail } from "~/api/services/leanerService";
import { getRelatedClasses } from "~/api/services/publicService";

const TutorDetail = () => {
  const { tutorId } = useParams();

  const [tutor, setTutor] = useState(null);
  const [relatedClasses, setRelatedClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("course");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========================
  // FETCH TUTOR DETAIL
  // =========================
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await getTutorDetail(tutorId);
        setTutor(res.data.result);
      } catch (err) {
        console.error("❌ Lỗi lấy tutor detail", err);
      }
    };

    fetchTutor();
  }, [tutorId]);

  // =========================
  // FETCH RELATED CLASSES
  // =========================
  useEffect(() => {
<<<<<<< HEAD
    if (!tutor?.subject?.subjectId || !tutor?.tutorId) return;

    const fetchRelated = async () => {
      try {
        const res = await getRelatedClasses({
          classId: tutor.classes?.[0]?.classId || 0,
          subjectId: tutor.subject.subjectId,
          tutorId: tutor.tutorId,
        });

        setRelatedClasses(res.data.result || []);
=======
    if (!tutor?.subjects?.length || !tutor?.tutorId) return;

    const fetchRelated = async () => {
      try {
        const data = await getRelatedClasses({
          subjectId: tutor.subjects[0].subjectId,
          tutorId: tutor.tutorId,
        });

        setRelatedClasses(data?.result || []);
>>>>>>> fb8771a7fa0410245d80184ca9c61dea0d2c1434
      } catch (err) {
        console.error("❌ Lỗi lấy lớp học liên quan", err);
      }
    };

    fetchRelated();
  }, [tutor]);


  // =========================
  // LOADING (SAU TOÀN BỘ HOOK)
  // =========================
  if (!tutor) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // =========================
  // DATA MAPPING
  // =========================
<<<<<<< HEAD
  const mainSubject = tutor.subject;
=======
  const mainSubject = tutor.subjects?.[0];
  const subjectNames = (tutor.subjects || [])
    .map((s) => s?.subjectName)
    .filter(Boolean)
    .join(', ');
>>>>>>> fb8771a7fa0410245d80184ca9c61dea0d2c1434
  const reviews = tutor.recentReviews || [];

  return (
    <div className="tutor-detail-page">
      {/* ================= HEADER ================= */}
      <div className="tutor-detail-header">
        <div className="image-section">
          <img
<<<<<<< HEAD
            src={tutor.avatarImage || tutor.avatarUrl || "/default-avatar.png"}
=======
            src={tutor.avatarUrl || tutor.avatarImage}
>>>>>>> fb8771a7fa0410245d80184ca9c61dea0d2c1434
            alt={tutor.fullName}
            className="main-img"
          />

          <div className="thumbnail-list">
<<<<<<< HEAD
            <img src={tutor.avatarImage || tutor.avatarUrl || "/default-avatar.png"} alt="" />
            <img src={tutor.avatarImage || tutor.avatarUrl || "/default-avatar.png"} alt="" />
            <img src={tutor.avatarImage || tutor.avatarUrl || "/default-avatar.png"} alt="" />
=======
            <img src={tutor.avatarUrl || tutor.avatarImage} alt="" />
            <img src={tutor.avatarUrl || tutor.avatarImage} alt="" />
            <img src={tutor.avatarUrl || tutor.avatarImage} alt="" />
>>>>>>> fb8771a7fa0410245d80184ca9c61dea0d2c1434
          </div>
        </div>

        <div className="info-section">
          <h2>{subjectNames || mainSubject?.subjectName || 'Gia sư'}</h2>
          <p>
            Giáo viên:{" "}
            <span className="teacher">{tutor.fullName}</span>
          </p>
          <h3 className="price">
            {Number(tutor.pricePerHour || 0).toLocaleString('vi-VN')}đ
          </h3>
          <p className="desc">{tutor.introduction}</p>

          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Đăng ký thuê gia sư
          </button>

          <TutorFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tutorId={tutor.tutorId}
            subjectId={mainSubject?.subjectId}
          />
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="tab-buttons">
        {["course", "teacher", "review"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "course" && "THÔNG TIN KHÓA HỌC"}
            {tab === "teacher" && "THÔNG TIN GIÁO VIÊN"}
            {tab === "review" && "ĐÁNH GIÁ CHI TIẾT"}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div className="tab-content">
        {activeTab === "course" && (
          <div>
            <p>{tutor.introduction}</p>
            <ul>
              <li>Kinh nghiệm: {tutor.educationalLevel}</li>
              <li>Trường: {tutor.university}</li>
              <li>Địa chỉ: {tutor.address}</li>
              <li>Môn dạy: {subjectNames || 'Chưa cập nhật'}</li>
              <li>Học thử trước khi học chính thức</li>
            </ul>
          </div>
        )}

        {activeTab === "teacher" && (
          <div className="teacher-info">
            <h4>{tutor.fullName}</h4>
            <p>
              {tutor.educationalLevel} - {tutor.university}
            </p>
            <p>Môn dạy: {subjectNames || 'Chưa cập nhật'}</p>
            <p>{tutor.introduction}</p>
          </div>
        )}

        {activeTab === "review" && (
          <div className="reviews-section">
            {reviews.map((r) => (
              <div key={r.ratingId} className="review-card">
                <div className="review-header">
                  <img
                    src={r.learnerAvatar}
                    alt={r.learnerName}
                    className="avatar"
                  />
                  <div>
                    <p className="name">{r.learnerName}</p>
                    <div className="stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                          key={i}
                          color={
                            i < Math.round(r.score)
                              ? "#f59e0b"
                              : "#e5e7eb"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="comment">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= OTHER CLASSES ================= */}
      <div className="other-classes">
        <h2>Lớp học khác</h2>
        <div className="class-grid">
          {relatedClasses.length === 0 && (
            <p>Không có lớp học liên quan</p>
          )}
          {relatedClasses.map((item, idx) => (
            <ClassCard
              key={item.classId ?? `${item.tutorId || 't'}-${item.subjectId || 's'}-${idx}`}
              image={item.avatarImage}
              subject={item.subjectName}
              teacherName={item.teacherName}
              teacherLevel={item.educationalLevel || item.university}
              price={item.pricePerHour}
              description={item.introduction}
              tutorId={item.tutorId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDetail;
