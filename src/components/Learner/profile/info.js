import React, { useEffect, useState } from "react";
import styles from "~/components/Learner/profile/Profile.module.scss";
import avt from "~/assets/imgs/img.jpg";
import { getLearnerProfile } from "~/api/services/leanerService";

// ----- Profile Tab -----
function ProfileTab({ onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== LOAD PROFILE FROM API =====
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getLearnerProfile();
        if (!data) return;

        // ⭐ MAP DATA TỪ BE → FORM FE
        setForm({
          name: data.fullName || "",
          phone: data.phoneNumber || "",
          address: data.address || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Load profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <div>Đang tải thông tin...</div>;

  return (
    <div className={styles.card}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <img src={avt} className={styles.avatarImg} alt="avatar" />
        </div>

        <h2 className={styles.username}>{form.name || "Người học"}</h2>
        <p style={{ color: "#666", fontSize: 14 }}>{form.email}</p>
      </div>

      {/* FORM */}
      <div className={styles.body}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Họ và tên</label>
            <input
              disabled={!editing}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Số điện thoại</label>
            <input
              disabled={!editing}
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div className={styles.fieldFull}>
            <label>Địa chỉ</label>
            <input
              disabled={!editing}
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          {editing ? (
            <>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => {
                  setEditing(false);
                }}
              >
                Hủy
              </button>

              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  onSave?.({
                    fullName: form.name,
                    phoneNumber: form.phone,
                    address: form.address,
                  });
                  setEditing(false);
                }}
              >
                Lưu thay đổi
              </button>
            </>
          ) : (
            <button
              className={`${styles.btns} ${styles.btnsPrimary}`}
              onClick={() => setEditing(true)}
            >
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;
