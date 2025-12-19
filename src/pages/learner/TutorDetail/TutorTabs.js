import React, { useState } from "react";
import "./TutorDetail.scss";

const TutorTabs = () => {
  const [activeTab, setActiveTab] = useState("course");

  return (
    <div className="tabs-container">
      <div className="tabs">
        <button
          className={activeTab === "course" ? "active" : ""}
          onClick={() => setActiveTab("course")}
        >
          THÔNG TIN KHÓA HỌC
        </button>
        <button
          className={activeTab === "teacher" ? "active" : ""}
          onClick={() => setActiveTab("teacher")}
        >
          THÔNG TIN GIÁO VIÊN
        </button>
        <button
          className={activeTab === "review" ? "active" : ""}
          onClick={() => setActiveTab("review")}
        >
          ĐÁNH GIÁ CHI TIẾT
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "course" && (
          <>
            <p><strong>Trung tâm U.Smart</strong> cung cấp đội ngũ gia sư sư phạm hàng đầu tại Hà Nội...</p>
            <ul>
              <li>Gia sư có phẩm chất đạo đức tốt, lý lịch rõ ràng.</li>
              <li>Tư vấn tìm gia sư miễn phí.</li>
              <li>Học thử 2 buổi tại nhà.</li>
              <li>Đổi gia sư nếu không hài lòng.</li>
              <li>Học phí phù hợp với từng học sinh.</li>
            </ul>
          </>
        )}

        {activeTab === "teacher" && (
          <p>Thông tin chi tiết về giáo viên đang được cập nhật...</p>
        )}

        {activeTab === "review" && (
          <p>Đánh giá chi tiết của học viên sẽ được hiển thị tại đây...</p>
        )}
      </div>
    </div>
  );
};

export default TutorTabs;
