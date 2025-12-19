import React, { useEffect, useState } from "react";
import styles from "./TutorSchedule.module.scss";
import { format } from "date-fns";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import TutorEventCard from "~/components/schedule/TutorEventCard";
import AvailabilityModal from "./components/AvailabilityModal/AvailabilityModal";
import AvailabilityList from "./components/availabilityList/AvailabilityList";
import ConfirmDialog from "./components/confirmDialog/ConfirmDialog";
import ScheduleTabs from "./components/scheduleTabs/ScheduleTabs";

import HeaderPage from "~/components/headerPage/HeaderPage";
import {
  fetchAvailabilities,
  fetchTeachingSchedule,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "~/api/services/tutorService";

const dayViToEnum = {
  "Thứ 2": "MONDAY",
  "Thứ 3": "TUESDAY",
  "Thứ 4": "WEDNESDAY",
  "Thứ 5": "THURSDAY",
  "Thứ 6": "FRIDAY",
  "Thứ 7": "SATURDAY",
  "Chủ nhật": "SUNDAY",
};

const enumToDayVi = {
  MONDAY: "Thứ 2",
  TUESDAY: "Thứ 3",
  WEDNESDAY: "Thứ 4",
  THURSDAY: "Thứ 5",
  FRIDAY: "Thứ 6",
  SATURDAY: "Thứ 7",
  SUNDAY: "Chủ nhật",
};

const sessionOf = (startTime = "") => {
  const [h] = startTime.split(":").map(Number);
  if (Number.isNaN(h)) return "";
  if (h < 12) return "Sáng";
  if (h < 18) return "Chiều";
  return "Tối";
};

export default function TutorSchedule() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [teachingSchedule, setTeachingSchedule] = useState([]);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate);
    // Fix: Handle Sunday (0) by treating it as day 7
    const day = currentDate.getDay() || 7; // If Sunday (0), use 7
    d.setDate(currentDate.getDate() - day + 1 + i); // Monday is day 1
    return d;
  });

  const mapApiToUi = (list = []) => list.map((item) => {
    const isoToHm = (s = '') => (s.includes('T') ? s.split('T')[1].slice(0, 5) : s);
    return {
      id: item.availabilityId || item.id,
      dayOfWeek: enumToDayVi[item.dayOfWeek] || item.dayOfWeek,
      startTime: isoToHm(item.startTime),
      endTime: isoToHm(item.endTime),
      status: item.status || 'AVAILABLE',
      startDate: item.startDate,
      endDate: item.endDate,
    };
  });

  const mapTeachingToUi = (list = []) => list.map((x) => ({
    date: x.studyDate,
    session: sessionOf(x.startTime),
    shift: `${x.startTime} - ${x.endTime}`,
    subject: x.subjectName,
    time: `${x.startTime} - ${x.endTime}`,
    student: x.learnerName,
    status: x.classStatus,
  }));

  const refreshAvailabilities = async () => {
    try {
      setLoadingAvailability(true);
      const list = await fetchAvailabilities();
      setAvailabilities(mapApiToUi(list || []));
    } catch (e) {
      console.error(e);
      alert('Tải lịch rảnh thất bại');
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    refreshAvailabilities();
  }, []);

  useEffect(() => {
    const loadTeachingSchedule = async () => {
      try {
        const list = await fetchTeachingSchedule();
        setTeachingSchedule(mapTeachingToUi(list || []));
      } catch (e) {
        console.error(e);
        alert('Tải lịch dạy thất bại');
      }
    };

    loadTeachingSchedule();
  }, []);

  const go = (days) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d);
  };

  const handleAddAvailability = () => {
    setEditingAvailability(null);
    setShowAvailabilityModal(true);
  };

  const handleEditAvailability = (index) => {
    setEditingAvailability({ ...availabilities[index], index });
    setShowAvailabilityModal(true);
  };

  const handleDeleteAvailability = (index) => {
    setDeletingIndex(index);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    const performDelete = async () => {
      if (deletingIndex !== null) {
        const id = availabilities[deletingIndex]?.id;
        try {
          if (id) {
            await deleteAvailability(id);
          }
          await refreshAvailabilities();
        } catch (e) {
          console.error(e);
          alert('Xóa lịch rảnh thất bại');
        } finally {
          setDeletingIndex(null);
          setShowConfirmDialog(false);
        }
      }
    };

    performDelete();
  };

  const handleSaveAvailability = async (data) => {
    const createPayload = {
      dayOfWeek: dayViToEnum[data.dayOfWeek] || data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status || 'AVAILABLE',
    };

    const updatePayload = {
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status || 'AVAILABLE',
    };

    try {
      if (editingAvailability?.id) {
        await updateAvailability(editingAvailability.id, updatePayload);
      } else {
        await createAvailability(createPayload);
      }
      await refreshAvailabilities();
      setShowAvailabilityModal(false);
      setEditingAvailability(null);
    } catch (e) {
      console.error(e);
      alert('Lưu lịch rảnh thất bại');
    }
  };

  return (
    <div className={styles.tutorSchedule}>
      <div className={styles.container}>
        <HeaderPage title="Quản lý lịch dạy" />
        <ScheduleTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'availability' && (
          <AvailabilityList
            availabilities={availabilities}
            onAdd={handleAddAvailability}
            onEdit={handleEditAvailability}
            onDelete={handleDeleteAvailability}
          />
        )}

        {activeTab === 'schedule' && (
          <>
            <div className={styles.header}>
              <h2>Lịch dạy</h2>

              <div className={styles.controls}>
          <button onClick={() => go(-7)}><FiChevronLeft /></button>
          <button onClick={() => setCurrentDate(new Date())} className={styles.today}>
            Hôm nay
          </button>
          <button onClick={() => go(7)}><FiChevronRight /></button>

          <div className={styles.dateBox}>
            <FiCalendar />
            <input 
              type="date" 
              value={format(currentDate, "yyyy-MM-dd")}
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendar}>
        
        {/* Header */}
        <div className={styles.timeCol}>Ca dạy</div>
        {weekDays.map((d, i) => (
          <div
            key={i}
            className={`${styles.dayHeader} ${
              format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                ? styles.activeDay
                : ""
            }`}
          >
            {d.getDay() === 0 ? "CN" : `Thứ ${d.getDay() + 1}`}
            <span>{format(d, "dd/MM")}</span>
          </div>
        ))}

        {/* Sáng */}
        <div className={styles.session}>Sáng</div>
        {weekDays.map((day, i) => (
          <div key={i} className={styles.cell}>
            {teachingSchedule
              .filter(x => x.date === format(day, "yyyy-MM-dd") && x.session === "Sáng")
              .map((x, i) => (<TutorEventCard key={i} data={x} />))
            }
          </div>
        ))}

        {/* Chiều */}
        <div className={styles.session}>Chiều</div>
        {weekDays.map((day, i) => (
          <div key={i} className={styles.cell}>
            {teachingSchedule
              .filter(x => x.date === format(day, "yyyy-MM-dd") && x.session === "Chiều")
              .map((x, i) => (<TutorEventCard key={i} data={x} />))
            }
          </div>
        ))}

        {/* Tối */}
        <div className={styles.session}>Tối</div>
        {weekDays.map((day, i) => (
          <div key={i} className={styles.cell}>
            {teachingSchedule
              .filter(x => x.date === format(day, "yyyy-MM-dd") && x.session === "Tối")
              .map((x, i) => (<TutorEventCard key={i} data={x} />))
            }
          </div>
        ))}
        </div>
          </>
        )}

        <AvailabilityModal
          isOpen={showAvailabilityModal}
          onClose={() => {
            setShowAvailabilityModal(false);
            setEditingAvailability(null);
          }}
          onSave={handleSaveAvailability}
          editData={editingAvailability}
          existingAvailabilities={availabilities}
        />

        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setDeletingIndex(null);
          }}
          onConfirm={confirmDelete}
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa lịch rảnh này không?"
        />
      </div>
    </div>
  );
}