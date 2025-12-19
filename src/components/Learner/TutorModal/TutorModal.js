import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import "./TutorModal.scss";

import SchedulePicker from "./SchedulePicker";
import {
  buildTrialPayload,
  buildOfficialSchedules,
} from "../../../utils/schedulePayloadMapper";

import {
  createTrialRequest,
  createOfficialRequest,
} from "../../../api/services/leanerService";

const TutorModal = ({
  isOpen,
  onClose,
  tutorId,
  subjectId,
}) => {
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [baseDate, setBaseDate] = useState(new Date());

  const [selectedSlots, setSelectedSlots] = useState([]);

  // ================= VALIDATION =================
  const validationError = useMemo(() => {
    if (!type) return "Vui lòng chọn hình thức học.";

    if (type === "trial" && selectedSlots.length !== 1)
      return "Chọn đúng 1 buổi học thử.";

    if (type === "official") {
      if (!startDate || !endDate)
        return "Vui lòng chọn ngày bắt đầu và kết thúc.";
      if (selectedSlots.length === 0)
        return "Chọn ít nhất 1 buổi.";
      if (new Set(
        selectedSlots.map(s => s.split("|")[0])
      ).size > 3)
        return "Tối đa 3 buổi mỗi tuần.";
    }

    return null;
  }, [type, selectedSlots, startDate, endDate]);

  if (!isOpen) return null;

  // ================= SLOT TOGGLE =================
  function handleToggleSlot(slotId) {
    if (type === "trial") {
      setSelectedSlots([slotId]);
      return;
    }

    setSelectedSlots(prev =>
      prev.includes(slotId)
        ? prev.filter(x => x !== slotId)
        : [...prev, slotId]
    );
  }

  // ================= SUBMIT =================
  async function handleSubmit(e) {
    e.preventDefault();
    if (validationError) return alert(validationError);

    try {
      if (type === "trial") {
        const trial = buildTrialPayload(selectedSlots[0]);

        const payload = {
          tutorId,
          subjectId,
          ...trial,
          additionalNotes: notes,
        };

        console.log("🔥 TRIAL PAYLOAD:", payload);

        await createTrialRequest(payload);
      }

      if (type === "official") {
        await createOfficialRequest({
          tutorId,
          subjectId,
          startDate,
          endDate,
          schedules: buildOfficialSchedules(selectedSlots),
          additionalNotes: notes,
        });
      }

      alert("Gửi yêu cầu thành công!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  }

  // ================= RENDER =================
  return ReactDOM.createPortal(
    <div className="tfm-overlay" onClick={onClose}>
      <div className="tfm-modal" onClick={e => e.stopPropagation()}>
        <button className="tfm-close" onClick={onClose}>×</button>

        <h2 className="tfm-title">Đăng ký thuê gia sư</h2>

        <form className="tfm-form" onSubmit={handleSubmit}>
          <div className="tfm-row">
            <label>Hình thức học</label>
            <select
              value={type}
              onChange={e => {
                setType(e.target.value);
                setSelectedSlots([]);
              }}
            >
              <option value="">-- Chọn --</option>
              <option value="trial">Học thử</option>
              <option value="official">Học chính thức</option>
            </select>
          </div>

          {type === "official" && (
                <div className="tfm-row tfm-date-range">
                  <div>
                    <label> Ngày bắt đầu    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label> Ngày kết thúc    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
          )}

          <SchedulePicker
            baseDate={baseDate}
            selectedSlots={selectedSlots}
            onToggleSlot={handleToggleSlot}
          />
          <div className="tfm-legend">
            <span>
              <div className="leg-box leg-free"></div> Rảnh
            </span>
            <span>
              <div className="leg-box leg-busy"></div> Bận
            </span>
            <span>
              <div className="leg-box leg-selected"></div> Đang chọn
            </span>
          </div>

          <div className="tfm-row">
            <label>Ghi chú</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Môn học / yêu cầu riêng..."
            />
          </div>

          <div className="tfm-actions">
            <button type="button" onClick={onClose} className="tfm-btn tfm-cancel">Hủy</button>
            <button type="submit" className="tfm-btn tfm-submit">Đăng ký ngay</button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default TutorModal;
