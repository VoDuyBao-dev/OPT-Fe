import React, { useState } from "react";
import "./TutorModal.scss";
import { getWeekDates } from "../../../utils/dateUtils";

/* ============================
   TIME SLOTS (BẮT BUỘC PHẢI CÓ)
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
  busySlots = [],
  selectedSlots = [],
  onToggleSlot,
  classType, // "trial" | "official"
}) {
  const [baseDate, setBaseDate] = useState(new Date());
  const weekDates = getWeekDates(baseDate);

  const maxSlots = classType === "trial" ? 1 : 2;

  const toInputDate = (date) => date.toISOString().split("T")[0];

  const prevWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d);
  };

  const nextWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d);
  };

  return (
    <>
      {/* ===== TOOLBAR ===== */}
      <div className="tfm-calendar-toolbar">
        <button onClick={prevWeek}>❮</button>
        <button className="today-btn" onClick={() => setBaseDate(new Date())}>
          Hôm nay
        </button>
        <button onClick={nextWeek}>❯</button>

        <input
          type="date"
          value={toInputDate(baseDate)}
          onChange={(e) => setBaseDate(new Date(e.target.value))}
        />
      </div>

      {/* ===== GRID ===== */}
      <div className="tfm-schedule-grid">
        <div />

        {/* HEADER */}
        {weekDates.map((date) => {
          const { dayName, dateText } = formatDayHeader(date);
          return (
            <div key={date} className="tfm-day-head">
              <div className="day-name">{dayName}</div>
              <div className="day-date">{dateText}</div>
            </div>
          );
        })}

        {/* SLOTS */}
        {TIME_SLOTS.map((slot) => (
          <React.Fragment key={slot.key}>
            <div className="tfm-session-cell">{slot.label}</div>

            {weekDates.map((date) => {
              const slotId = `${date}|${slot.key}`;
              const isBusy = busySlots.includes(slotId);
              const isSelected = selectedSlots.includes(slotId);
              const isDisabled =
                !isSelected && selectedSlots.length >= maxSlots;

              return (
                <div
                  key={slotId}
                  className={[
                    "tfm-slot",
                    isBusy && "busy",
                    isSelected && "selected",
                    isDisabled && "disabled",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (isBusy || isDisabled) return;
                    onToggleSlot(slotId);
                  }}
                >
                  {slot.label}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
