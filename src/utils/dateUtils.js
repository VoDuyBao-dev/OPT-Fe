export function formatYMD(date) {
  return date.toISOString().slice(0, 10);
}

export function getWeekDates(baseDate = new Date()) {
  const d = new Date(baseDate);
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));

  // Return full week (Monday -> Sunday) as YYYY-MM-DD strings
  return Array.from({ length: 7 }).map((_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return formatYMD(x);
  });
}

export function getDayOfWeekEnum(dateStr) {
  const map = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return map[new Date(dateStr).getDay()];
}
