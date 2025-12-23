import React, { useEffect, useState } from "react";
import styles from "./EBooks.module.scss";
import EbookDetail from "./EBooksDetail";
import { getAllEbooks, searchEbooks } from "~/api/services/leanerService";
import EBookCard from "../../../components/e-Books-Card/E-Book-Card";

export default function EBooks() {
  const [ebooks, setEbooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const loadEbooks = async () => {
      try {
        const res = typeFilter
          ? await searchEbooks({ type: typeFilter })
          : await getAllEbooks();

        console.log("EBOOK API:", res);

        // ✅ FIX: API KHÔNG CÓ result → LẤY TRỰC TIẾP items
        const rawData = res?.items || [];

        const mapped = rawData.map((e) => ({
          id: e.ebookId,
          title: e.title,
          author: e.uploadedByName,
          date: e.createdAt,
          type: e.type,
          path: e.filePath,
        }));

        setEbooks(mapped);
      } catch (err) {
        console.error("Load ebooks error:", err);
        setEbooks([]);
      }
    };

    loadEbooks();
  }, [typeFilter]);

  return (
    <div className={styles.eRoot}>
      {/* FILTER */}
      <div className={styles.eSidebar}>
        <h3>Tìm tài liệu</h3>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="SACH_GIAO_KHOA">Sách giáo khoa</option>
          <option value="TAI_LIEU">Tài liệu</option>
          <option value="DE_THI_THAM_KHAO">Đề thi tham khảo</option>
        </select>

        <button className={styles.searchBtn}>Tìm kiếm</button>
      </div>

      {/* LIST */}
      <main className={styles.eContent}>
        {ebooks.length === 0 && <p>Không có tài liệu</p>}

        {ebooks.map((e) => (
          <EBookCard
            key={e.id}
            title={e.title}
            author={e.author}
          >
            <a
              href={e.path}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnDơwnload}
            >
              📥 Xem / Tải
            </a>

            <button
              className={styles.btnLight}
              onClick={() => setSelected(e)}
            >
              ℹ️ Chi tiết
            </button>
          </EBookCard>

        ))}
      </main>

      {selected && (
        <EbookDetail
          data={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
