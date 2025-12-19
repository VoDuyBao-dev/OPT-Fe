import React, { useEffect, useState } from "react";
import styles from "./AdminEbooks.module.scss";
import HeaderPage from "~/components/headerPage/HeaderPage";
import EbookDetail from "../../learner/e-books/EBooksDetail";
import AdminEbookModal from "./AdminEbookModal";

import {
  getAdminEbooks,
  createEbook,
  updateEbook,
  deleteEbook,
} from "~/api/services/adminService";

export default function AdminEBooks() {
  const [ebooks, setEbooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const loadEbooks = async () => {
    const res = await getAdminEbooks({ keyword, type: typeFilter });
    const mapped = res.items.map((e) => ({
      id: e.ebookId,
      title: e.title,
      author: e.uploadedByName,
      date: e.createdAt,
      type: e.type,
      desc: e.title,
    }));
    setEbooks(mapped);
  };

  useEffect(() => {
    loadEbooks();
  }, [keyword, typeFilter]);

  const handleSave = async (data) => {
    if (editing) {
      await updateEbook({ ebookId: editing.id, ...data });
    } else {
      await createEbook(data);
    }
    setOpenModal(false);
    setEditing(null);
    loadEbooks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá ebook này?")) return;
    await deleteEbook(id);
    loadEbooks();
  };

  return (
    <div className={styles.title}>
      <HeaderPage title="Quản lý Tài liệu học tập" />

      <button
        className={styles.btnPrimary}
        onClick={() => setOpenModal(true)}
      >
        + Thêm Ebook
      </button>

      <div className={styles.eRoot}>
        {/* FILTER */}
        <aside className={styles.eSidebar}>
          <input
            placeholder="Tìm theo từ khoá"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="SACH_GIAO_KHOA">Sách giáo khoa</option>
            <option value="TAI_LIEU">Tài liệu</option>
            <option value="DE_THI_THAM_KHAO">Đề thi</option>
          </select>
        </aside>

        {/* LIST */}
        <main className={styles.eContent}>
          {ebooks.map((e) => (
            <div key={e.id} className={styles.eCard}>
              <div className={styles.eInfo}>
                <h3>{e.title}</h3>
                <p>{e.author}</p>

                <div className={styles.actions}>
                  <button onClick={() => setSelected(e)}>Chi tiết</button>
                  <button
                    onClick={() => {
                      setEditing(e);
                      setOpenModal(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className={styles.btnDanger}
                    onClick={() => handleDelete(e.id)}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {selected && (
        <EbookDetail data={selected} onClose={() => setSelected(null)} />
      )}

      <AdminEbookModal
        open={openModal}
        initial={editing}
        onClose={() => {
          setOpenModal(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}
