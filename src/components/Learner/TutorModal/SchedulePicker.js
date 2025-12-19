import React from "react";
import "./TutorModal.scss";
import { getWeekDates } from "../../../utils/dateUtils";

/* ============================
   TIME SLOTS
============================ */
const TIME_SLOTS = [
  { key: "morning1", label: "08:00 - 09:30" },
  { key: "morning2", label: "09:30 - 11:00" },
  { key: "afternoon1", label: "13:00 - 14:30" },
  { key: "afternoon2", label: "14:30 - 16:00" },
  { key: "evening1", label: "17:00 - 18:30" },
  { key: "evening2", label: "18:30 - 20:00" },
];

/* ============================
   FORMAT DAY HEADER
============================ */
const formatDayHeader = (dateStr) => {
  const date = new Date(dateStr);

  const dayMap = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  return {
    dayName: dayMap[date.getDay()],
    dateText: `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`,
  };
};

/* ============================
   COMPONENT
============================ */
export default function SchedulePicker({
  baseDate,
  busySlots = [],
  selectedSlots = [],
  onToggleSlot,
}) {
  const weekDates = getWeekDates(baseDate);

  return (
    <div className="tfm-schedule-grid">
      {/* Empty corner */}
      <div />

      {/* ===== DAY HEADERS ===== */}
      {weekDates.map((date) => {
        const { dayName, dateText } = formatDayHeader(date);

        return (
          <div key={date} className="tfm-day-head">
            <div className="day-name">{dayName}</div>
            <div className="day-date">{dateText}</div>
          </div>
        );
      })}

      {/* ===== TIME SLOTS ===== */}
      {TIME_SLOTS.map((slot) => (
        <React.Fragment key={slot.key}>
          <div className="tfm-session-cell">{slot.label}</div>

          {weekDates.map((date) => {
            const slotId = `${date}|${slot.key}`;
            const isBusy = busySlots.includes(slotId);
            const isSelected = selectedSlots.includes(slotId);

            return (
              <div
                key={slotId}
                className={[
                  "tfm-slot",
                  isBusy && "busy",
                  isSelected && "selected",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => !isBusy && onToggleSlot(slotId)}
              >
                {slot.label}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
