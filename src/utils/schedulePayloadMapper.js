import { getDayOfWeekEnum } from "./dateUtils";

const SLOT_TIME = {
  morning1: ["08:00", "09:30"],
  morning2: ["09:30", "11:00"],
  afternoon1: ["13:00", "14:30"],
  afternoon2: ["14:30", "16:00"],
  evening1: ["17:00", "18:30"],
  evening2: ["18:30", "20:00"],
};

export function buildTrialPayload(slotId) {
  const [date, slotKey] = slotId.split("|");
  const [startTime, endTime] = SLOT_TIME[slotKey];

  // Normalize to hh:mm:ss
  const formatSec = (t) => (t.length === 5 ? `${t}:00` : t);

  return {
    trialDate: date,
    dayOfWeek: getDayOfWeekEnum(date),
    startTime: formatSec(startTime),
    endTime: formatSec(endTime),
  };
}

export function buildOfficialSchedules(slotIds) {
  const map = {};

  slotIds.forEach(id => {
    const [date, slotKey] = id.split("|");
    const dow = getDayOfWeekEnum(date);
    map[dow] = SLOT_TIME[slotKey];
  });

  const formatSec = (t) => (t.length === 5 ? `${t}:00` : t);
  return Object.entries(map).map(([dayOfWeek, [startTime, endTime]]) => ({
    dayOfWeek,
    startTime: formatSec(startTime),
    endTime: formatSec(endTime),
  }));
}
