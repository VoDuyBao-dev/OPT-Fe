import React, { useEffect, useState } from "react";
import {
  getTutorFilters,
  searchTutorsByFilter,
  searchTutorsByKeyword,
} from "~/api/services/leanerService";

const FilterSidebar = ({ onResult }) => {
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");

  // ============================
  // Load filter data
  // ============================
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await getTutorFilters();
        setSubjects(data.subjects || []);
        setLevels(data.educationalLevels || []);
      } catch (err) {
        console.error("Load filter error:", err);
      }
    };

    loadFilters();
  }, []);

  // ============================
  // Search by keyword
  // ============================
  const handleSearch = async () => {
    try {
      let data;

      if (keyword.trim()) {
        data = await searchTutorsByKeyword(keyword);
      } else {
        data = await searchTutorsByFilter({
          subjectId,
          educationalLevel,
        });
      }

      onResult?.(data);
    } catch (err) {
      console.error("Search tutors error:", err);
    }
  };

  return (
    <aside className="filter-sidebar">
      <h2 className="sidebar-title">Tìm gia sư</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm theo tên, môn, trình độ"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* Educational level */}
      <select
        value={educationalLevel}
        onChange={(e) => setEducationalLevel(e.target.value)}
      >
        <option value="">Trình độ chuyên môn</option>
        {levels.map((lv) => (
          <option key={lv} value={lv}>
            {lv}
          </option>
        ))}
      </select>

      {/* Subjects */}
      <select
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
      >
        <option value="">Chọn môn</option>
        {subjects.map((s) => (
          <option key={s.subjectId} value={s.subjectId}>
            {s.subjectName}
          </option>
        ))}
      </select>

      <button className="search-btn" onClick={handleSearch}>
        Tìm kiếm
      </button>
    </aside>
  );
};

export default FilterSidebar;
