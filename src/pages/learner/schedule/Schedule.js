import React, { useEffect, useState } from "react";
import styles from "./Schedule.module.scss";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import EventCard from "~/components/schedule/eventCard";
import { getLearnerCalendar } from "~/api/services/leanerService";

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // Tính tuần hiện tại
  // =========================
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // =========================
  // Load lịch học
  // =========================
  useEffect(() => {
    const loadCalendar = async () => {
      try {
        setLoading(true);

        const from = format(weekStart, "yyyy-MM-dd");
        const to = format(weekEnd, "yyyy-MM-dd");

        const res = await getLearnerCalendar(from, to);

        const mapped = res.map((x) => ({
          id: x.calendarClassId,
          date: x.date,
          session: x.session,
          subject: x.subjectName,
          tutor: x.tutorName,
          time: `${x.startTime.slice(0,5)} - ${x.endTime.slice(0,5)}`,
        }));

        setScheduleData(mapped);
      } catch (err) {
        console.error("Load calendar error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCalendar();
  }, [currentDate]);

  const go = (days) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Lịch học</h2>

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

      {loading && <p className={styles.loading}>Đang tải lịch...</p>}

      <div className={styles.calendar}>
        {/* Header */}
        <div className={styles.timeCol}>Ca học</div>
        {weekDays.map((d, i) => (
          <div
            key={i}
            className={`${styles.dayHeader} ${
              format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                ? styles.activeDay
                : ""
            }`}
          >
            Thứ {d.getDay() === 0 ? "CN" : d.getDay() + 1}
            <span>{format(d, "dd/MM")}</span>
          </div>
        ))}

        {/* Sáng */}
        <div className={styles.session}>Sáng</div>
        {weekDays.map((day, i) => (
          <div key={i} className={styles.cell}>
            {scheduleData
              .filter(
                (x) =>
                  x.date === format(day, "yyyy-MM-dd") &&
                  x.session === "Sáng"
              )
              .map((x) => (
                <EventCard key={x.id} data={x} />
              ))}
          </div>
        ))}

        {/* Chiều */}
        <div className={styles.session}>Chiều</div>
        {weekDays.map((day, i) => (
          <div key={i} className={styles.cell}>
            {scheduleData
              .filter(
                (x) =>
                  x.date === format(day, "yyyy-MM-dd") &&
                  x.session === "Chiều"
              )
              .map((x) => (
                <EventCard key={x.id} data={x} />
              ))}
          </div>
        ))}

        {/* Tối */}
        <div className={styles.session}>Tối</div>
        {weekDays.map((day, i) => (
          <div key={i} className={styles.cell}>
            {scheduleData
              .filter(
                (x) =>
                  x.date === format(day, "yyyy-MM-dd") &&
                  x.session === "Tối"
              )
              .map((x) => (
                <EventCard key={x.id} data={x} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
