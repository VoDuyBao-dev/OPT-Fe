export function formatYMD(date) {
  return date.toISOString().slice(0, 10);
}

export function getWeekDates(baseDate = new Date()) {
  const d = new Date(baseDate);
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));

  return Array.from({ length: 6 }).map((_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i + 1);
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
