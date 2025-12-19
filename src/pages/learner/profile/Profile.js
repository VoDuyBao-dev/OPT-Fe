import React, { useEffect, useState } from "react";
import styles from "../../../components/Learner/profile/Profile.module.scss";
import ProfileTab from "~/components/Learner/profile/info";

import {
  getLearnerProfile,
  updateLearnerProfile,
} from "~/api/services/leanerService";

export default function LearnerDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // Load profile khi vào trang
  // ============================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getLearnerProfile();

        setUser({
          name: data.fullName,
          email: data.email,
          phone: data.phoneNumber,
          address: data.address,
        });
      } catch (err) {
        console.error("Load profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ============================
  // Save profile
  // ============================
  const handleSaveProfile = async (form) => {
    try {
      await updateLearnerProfile({
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
      });

      // cập nhật lại UI
      setUser({ ...form });

      alert("✅ Cập nhật thông tin thành công");
    } catch (err) {
      console.error("Update profile error:", err);
      alert("❌ Cập nhật thất bại");
    }
  };

  if (loading) {
    return <div className={styles["ld-root"]}>Đang tải thông tin...</div>;
  }

  return (
    <div className={styles["ld-root"]}>
      <main className={styles["ld-main"]}>
        {user && <ProfileTab user={user} onSave={handleSaveProfile} />}
      </main>
    </div>
  );
}
