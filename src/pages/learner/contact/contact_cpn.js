import React from "react";
import "./Contact.scss";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Logo } from "~/components/layouts/header/headerComp";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="map-container">
        <iframe
          title="U.Smart Map"
          src="https://www.google.com/maps?q=259+Tr%E1%BA%A7n+H%C6%B0ng+%C4%90%E1%BA%A1o,+Ph%C6%B0%E1%BB%9Dng+C%C3%B4+Giang,+Qu%E1%BA%ADn+1,+TP.HCM,+Vi%E1%BB%87t+Nam&output=embed"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="contact-content">
        {/* Form liên hệ */}
        <div className="contact-form">
          <h2>Liên hệ với chúng tôi:</h2>
          <input type="text" placeholder="Họ và tên:*" />
          <input type="email" placeholder="Email:*" />
          <textarea placeholder="Nội dung:*"></textarea>
          <button className="btn-submit">Gửi liên hệ</button>
        </div>

        {/* Thông tin liên hệ */}
        <div className="contact-info">
          <div className="logo">
            <Logo />
          </div>
          <p>
            TutorFinder là một trong những tổ chức giáo dục uy tín hàng đầu tại Việt Nam
            với hơn 20 trung tâm trên toàn quốc cùng với chất lượng đào tạo
            chuyên nghiệp...
          </p>

          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <span>259 Trần Hưng Đạo, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam</span>
          </div>
          <div className="info-item">
            <FaPhoneAlt className="icon" style={{ color: "#12cf64ff" }} />
            <span>19006750</span>
          </div>
          <div className="info-item">
            <FaEnvelope className="icon" style={{ color: "#e0432bff" }} />
            <span>awesome160916@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
