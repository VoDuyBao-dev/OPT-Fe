import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import "./TutorModal.scss";

import SchedulePicker, {
  mapAvailabilitiesToBusySlots,
} from "./SchedulePicker";

import {
  buildTrialPayload,
  buildOfficialSchedules,
} from "../../../utils/schedulePayloadMapper";

import { formatYMD } from "../../../utils/dateUtils";
import Toast from "../../toast/Toast";

import {
  getTutorAvailabilities,
  createTrialRequest,
  previewOfficialClass,
} from "../../../api/services/leanerService";

const TutorModal = ({
  isOpen,
  onClose,
  tutorId,
  subjectId,
  subject,
}) => {
  // Support either `subjectId` or a `subject` object passed by callers
  const resolvedSubjectId = subjectId || subject?.subjectId || subject?.id || subject?.subject_id || null;
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [busySlots, setBusySlots] = useState([]);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  /* ================= LOAD AVAILABILITIES ================= */
  useEffect(() => {
    if (!isOpen || !tutorId) return;

    async function loadAvailabilities() {
      // Ensure user is authenticated before calling backend
      const token = localStorage.getItem('token');
      if (!token) {
        setNeedsAuth(true);
        setBusySlots([]);
        return;
      } else {
        setNeedsAuth(false);
      }

      // Use a dynamic date window (today -> +30 days) to increase chance of having data
      const today = new Date();
      const fromDate = formatYMD(today);
      const toDate = formatYMD(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30));

      try {
        const availabilities = await getTutorAvailabilities(
          tutorId,
          fromDate,
          toDate
        );

        console.debug("Tutor availabilities:", availabilities);

        const busy = mapAvailabilitiesToBusySlots(availabilities || []);
        setBusySlots(busy);
      } catch (err) {
        if (err?.response?.status === 401) {
          setNeedsAuth(true);
          setToast({ message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.', type: 'error' });
          setTimeout(() => {
            navigate('/account/login');
          }, 1000);
          return;
        }
        console.error("❌ Lỗi khi lấy availabilities:", err?.response?.data || err);
        setBusySlots([]);
      }
    }

    loadAvailabilities();
  }, [isOpen, tutorId]);

  /* ================= VALIDATION ================= */
  const validationError = useMemo(() => {
    if (!type) return "Vui lòng chọn hình thức học.";

    if (type === "trial" && selectedSlots.length !== 1)
      return "Học thử chỉ được chọn 1 buổi.";

    if (type === "official") {
      if (!startDate || !endDate)
        return "Vui lòng chọn ngày bắt đầu và kết thúc.";
      if (selectedSlots.length !== 2)
        return "Học chính thức phải chọn đúng 2 buổi.";
    }

    return null;
  }, [type, selectedSlots, startDate, endDate]);

  if (!isOpen) return null;

  /* ================= SLOT TOGGLE ================= */
  const handleToggleSlot = (slotId) => {
    if (type === "trial") {
      setSelectedSlots([slotId]);
      return;
    }

    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((x) => x !== slotId)
        : [...prev, slotId]
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationError) {
      setToast({ message: validationError, type: 'error' });
      return;
    }

    function validateOfficialPayload(p) {
      if (!p.startDate || !p.endDate) return 'Vui lòng chọn ngày bắt đầu và kết thúc.';
      if (new Date(p.endDate) < new Date(p.startDate)) return 'Ngày kết thúc phải sau ngày bắt đầu.';
      if (!Array.isArray(p.schedules) || p.schedules.length !== 2) return 'Học chính thức phải chọn đúng 2 buổi.';

      const dayEnumSet = new Set(['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']);
      const days = new Set();
      for (const s of p.schedules) {
        if (!s.dayOfWeek || !dayEnumSet.has(s.dayOfWeek)) return 'Dữ liệu lịch không hợp lệ.';
        // Accept HH:MM or HH:MM:SS (backend may return seconds)
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(s.startTime) || !/^\d{2}:\d{2}(:\d{2})?$/.test(s.endTime)) return 'Định dạng thời gian không hợp lệ.';
        if (days.has(s.dayOfWeek)) return 'Vui lòng chọn 2 buổi rơi vào 2 ngày khác nhau.';
        days.add(s.dayOfWeek);
      }

      return null;
    }

    try {
      if (type === "trial") {
        if (!resolvedSubjectId) {
          setToast({ message: 'Môn học không xác định. Vui lòng thử lại.', type: 'error' });
          return;
        }

        const payload = {
          tutorId,
          subjectId: resolvedSubjectId,
          ...buildTrialPayload(selectedSlots[0]),
          additionalNotes: notes,
        };

        console.debug('Creating trial with payload:', payload);
        const trialRes = await createTrialRequest(payload);
        console.debug('Create trial response:', trialRes);

        setToast({ message: 'Gửi yêu cầu học thử thành công!', type: 'success' });
        // show toast briefly then close modal
        setTimeout(() => {
          setToast({ message: '', type: '' });
          onClose();
        }, 1400);
        return;
      }

      // Official flow
      if (!resolvedSubjectId) {
        setToast({ message: 'Môn học không xác định. Vui lòng thử lại.', type: 'error' });
        return;
      }

      // Coerce and normalize payload fields to match backend expectations
      const officialPayload = {
        tutorId: Number(tutorId),
        subjectId: Number(resolvedSubjectId),
        startDate: startDate, // input[type=date] produces YYYY-MM-DD
        endDate: endDate,
        schedules: buildOfficialSchedules(selectedSlots).map(s => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime.length === 5 ? `${s.startTime}:00` : s.startTime,
          endTime: s.endTime.length === 5 ? `${s.endTime}:00` : s.endTime,
        })),
        additionalNotes: notes,
      };

      // Validate before sending
      const validationMsg = validateOfficialPayload(officialPayload);
      if (validationMsg) {
        setToast({ message: validationMsg, type: 'error' });
        console.warn('Official payload validation failed:', validationMsg, officialPayload);
        return;
      }

      console.debug('Preview official payload:', officialPayload);
      const res = await previewOfficialClass(officialPayload);
      console.debug('Preview response:', res);

      // Navigate to confirmation with preview data returned by backend
      navigate("/payment/confirmation", {
        state: {
          requestPayload: officialPayload,
          previewData: res?.data?.result,
        },
      });

      return;
    } catch (err) {
      console.error('Submit error:', err);
      // Try to show detailed server error if available
      const serverData = err?.response?.data;
      if (serverData) {
        try {
          console.error('Server response body:', JSON.stringify(serverData, null, 2));
          setToast({ message: serverData.message || JSON.stringify(serverData), type: 'error' });
        } catch (e) {
          setToast({ message: serverData.message || 'Có lỗi xảy ra', type: 'error' });
        }
      } else {
        setToast({ message: err.message || 'Có lỗi xảy ra', type: 'error' });
      }
    }
  };

  /* ================= DEV HELPERS ================= */
  // Developer-only helper to reproduce official preview requests quickly
  const runPreviewTest = async () => {
    if (!resolvedSubjectId) {
      setToast({ message: 'Môn học không xác định. Vui lòng thử lại.', type: 'error' });
      return;
    }

    const now = new Date();
    const d1 = new Date(now);
    d1.setDate(now.getDate() + 7);
    const d2 = new Date(now);
    d2.setDate(now.getDate() + 8);

    const slot1 = `${formatYMD(d1)}|morning1`;
    const slot2 = `${formatYMD(d2)}|afternoon1`;

    const payload = {
      tutorId: Number(tutorId),
      subjectId: Number(resolvedSubjectId),
      startDate: formatYMD(now),
      endDate: formatYMD(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30)),
      schedules: buildOfficialSchedules([slot1, slot2]),
      additionalNotes: 'Dev preview test',
    };

    console.debug('Running preview test with payload:', payload);

    try {
      const res = await previewOfficialClass(payload);
      console.debug('Preview test response:', res);
      setToast({ message: 'Preview test succeeded (see console).', type: 'success' });
    } catch (err) {
      console.error('Preview test error:', err);
      const serverData = err?.response?.data;
      setToast({ message: serverData?.message || err.message || 'Preview test failed', type: 'error' });
    }
  };

  /* ================= RENDER ================= */
  return ReactDOM.createPortal(
    <div className="tfm-overlay" onClick={onClose}>
      <div className="tfm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="tfm-close" onClick={onClose}>×</button>

        <h2 className="tfm-title">Đăng ký thuê gia sư</h2>

        <form className="tfm-form" onSubmit={handleSubmit}>
          <div className="tfm-row">
            <label>Hình thức học</label>
            <select
              value={type}
              onChange={(e) => {
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
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label>Ngày kết thúc</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {needsAuth ? (
            <div className="tfm-auth-banner">
              <p>Bạn cần đăng nhập để xem lịch gia sư.</p>
              <div className="tfm-auth-actions">
                <button type="button" onClick={() => navigate('/account/login')} className="tfm-btn">
                  Đăng nhập
                </button>
                <button type="button" onClick={() => onClose()} className="tfm-btn tfm-cancel">
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <SchedulePicker
              busySlots={busySlots}
              selectedSlots={selectedSlots}
              classType={type}
              onToggleSlot={handleToggleSlot}
            />
          )}

          <div className="tfm-legend">
            <span><div className="leg-box leg-free" /> Rảnh</span>
            <span><div className="leg-box leg-busy" /> Bận</span>
            <span><div className="leg-box leg-selected" /> Đang chọn</span>
          </div>

          <div className="tfm-row">
            <label>Ghi chú</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Môn học / yêu cầu riêng..."
            />
          </div>

          <div className="tfm-actions">
            <button type="button" onClick={onClose} className="tfm-btn tfm-cancel">
              Hủy
            </button>
            <button type="submit" className="tfm-btn tfm-submit">
              Đăng ký ngay
            </button>

            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                className="tfm-btn tfm-debug"
                onClick={() => runPreviewTest()}
                style={{ marginLeft: 8, background: '#6a5acd', color: 'white' }}
              >
                Run preview test
              </button>
            )}
          </div>
        </form>

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />

      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default TutorModal;
