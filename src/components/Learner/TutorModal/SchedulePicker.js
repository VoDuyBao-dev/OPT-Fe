import React, { useState } from "react";
import "./TutorModal.scss";
import { getWeekDates } from "../../../utils/dateUtils";

/* ============================
   TIME SLOT DEFINITIONS
============================ */
export const TIME_SLOT_MAP = {
  morning1: { start: "08:00", end: "09:30" },
  morning2: { start: "09:30", end: "11:00" },
  afternoon1: { start: "13:00", end: "14:30" },
  afternoon2: { start: "14:30", end: "16:00" },
  evening1: { start: "17:00", end: "18:30" },
  evening2: { start: "18:30", end: "20:00" },
};

const TIME_SLOTS = [
  { key: "morning1", label: "08:00 - 09:30" },
  { key: "morning2", label: "09:30 - 11:00" },
  { key: "afternoon1", label: "13:00 - 14:30" },
  { key: "afternoon2", label: "14:30 - 16:00" },
  { key: "evening1", label: "17:00 - 18:30" },
  { key: "evening2", label: "18:30 - 20:00" },
];

/* ============================
   UTILS
============================ */
function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isOverlap(aStart, aEnd, bStart, bEnd) {
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

/* ============================
   MAP BE → BUSY SLOTS
============================ */
export function mapAvailabilitiesToBusySlots(availabilities = []) {
  const busy = [];

  availabilities.forEach((a) => {
    if (a.status !== "BOOKED") return;

    const aStart = timeToMinutes(a.startTime);
    const aEnd = timeToMinutes(a.endTime);

    Object.entries(TIME_SLOT_MAP).forEach(([slotKey, slot]) => {
      const sStart = timeToMinutes(slot.start);
      const sEnd = timeToMinutes(slot.end);

      if (isOverlap(aStart, aEnd, sStart, sEnd)) {
        busy.push(`${a.startDate}|${slotKey}`);
      }
    });
  });

  return busy;
}

/* ============================
   HEADER FORMAT
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

  const toInputDate = (date) =>
    typeof date === "string" ? date : date.toISOString().split("T")[0];

  const changeWeek = (offset) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset);
    setBaseDate(d);
  };

  return (
    <>
      {/* TOOLBAR */}
      <div className="tfm-calendar-toolbar">
        <button onClick={() => changeWeek(-7)}>❮</button>
        <button onClick={() => setBaseDate(new Date())}>Hôm nay</button>
        <button onClick={() => changeWeek(7)}>❯</button>

        <input
          type="date"
          value={toInputDate(baseDate)}
          onChange={(e) => setBaseDate(new Date(e.target.value))}
        />
      </div>

      {/* GRID */}
      <div className="tfm-schedule-grid">
        <div />

        {weekDates.map((date) => {
          const { dayName, dateText } = formatDayHeader(toInputDate(date));
          return (
            <div key={toInputDate(date)} className="tfm-day-head">
              <div className="day-name">{dayName}</div>
              <div className="day-date">{dateText}</div>
            </div>
          );
        })}

        {TIME_SLOTS.map((slot) => (
          <React.Fragment key={slot.key}>
            <div className="tfm-session-cell">{slot.label}</div>

            {weekDates.map((date) => {
              const slotId = `${toInputDate(date)}|${slot.key}`;
              const isBusy = busySlots.includes(slotId);
              const isSelected = selectedSlots.includes(slotId);
              const isDisabled =
                !isSelected && selectedSlots.length >= maxSlots && classType !== "trial";

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
