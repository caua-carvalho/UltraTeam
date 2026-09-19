/**
 * Formats a Date object to YYYY-MM-DD local string without timezone shifting.
 */
export function formatLocalDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Safely parses a YYYY-MM-DD string into a local Date object at noon (12:00:00) to avoid timezone shifts.
 */
export function parseISODate(dateString: string): Date {
  if (!dateString) return new Date();
  if (dateString.includes('T')) {
    return new Date(dateString);
  }
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Get Monday of the week for a given date in YYYY-MM-DD format (Monday = 1st day of week)
 */
export function getWeekStart(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISODate(date) : new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  d.setDate(diff);
  return formatLocalDateToISO(d);
}

/**
 * Get Sunday of the week for a given date in YYYY-MM-DD format (Sunday = last day of week)
 */
export function getWeekEnd(date: Date | string = new Date()): string {
  const mondayStr = getWeekStart(date);
  const monday = parseISODate(mondayStr);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return formatLocalDateToISO(sunday);
}

/**
 * Add or subtract a number of weeks from a date string (YYYY-MM-DD)
 */
export function addWeeks(dateString: string, weeks: number): string {
  const d = parseISODate(dateString);
  d.setDate(d.getDate() + weeks * 7);
  return formatLocalDateToISO(d);
}

/**
 * Add days to a date string
 */
export function addDays(dateString: string, days: number): string {
  const d = parseISODate(dateString);
  d.setDate(d.getDate() + days);
  return formatLocalDateToISO(d);
}

/**
 * Get all 7 days of the week starting from Monday
 */
export function getWeekDays(mondayStr: string): Array<{
  dateStr: string;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
  isPast: boolean;
}> {
  const todayStr = formatLocalDateToISO(new Date());
  const monday = parseISODate(mondayStr);
  const dayNames = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

  return Array.from({ length: 7 }, (_, i) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const dateStr = formatLocalDateToISO(current);

    return {
      dateStr,
      dayNumber: current.getDate(),
      dayName: dayNames[i],
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
    };
  });
}

/**
 * Check if a date is within [weekStart, weekEnd] inclusive
 */
export function isDateInWeek(dateStr: string, weekStart: string, weekEnd: string): boolean {
  return dateStr >= weekStart && dateStr <= weekEnd;
}

/**
 * Check if date is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === formatLocalDateToISO(new Date());
}

/**
 * Check if date is in the past
 */
export function isPastDate(dateStr: string): boolean {
  return dateStr < formatLocalDateToISO(new Date());
}

/**
 * Format date for display (e.g., "18 SET")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = parseISODate(dateString);
  return date
    .toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
    .replace('.', '')
    .toUpperCase();
}

/**
 * Format date with month and year (e.g., "SET 2026")
 */
export function formatMonthYear(dateString: string): string {
  if (!dateString) return '';
  const date = parseISODate(dateString);
  return date
    .toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();
}

/**
 * Format full date with day of week (e.g., "SEG, 18 SET")
 */
export function formatFullDate(dateString: string): string {
  if (!dateString) return '';
  const date = parseISODate(dateString);
  return date
    .toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    })
    .replace('.', '')
    .toUpperCase();
}

/**
 * Format activity type for display
 */
export function formatActivityType(type: string): string {
  const types: Record<string, string> = {
    tiro: 'TIRO',
    longo: 'LONGO',
    leve: 'LEVE',
    curto: 'CURTO',
  };
  return types[type] || (type ? type.toUpperCase() : '');
}

/**
 * Get badge color scheme for activity type
 */
export function getActivityTypeBadgeColor(type: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (type?.toLowerCase()) {
    case 'longo':
      return {
        bg: 'bg-[#FFB800]/10',
        text: 'text-[#FFB800]',
        border: 'border-[#FFB800]/40',
      };
    case 'tiro':
      return {
        bg: 'bg-[#FF2A3D]/10',
        text: 'text-[#FF2A3D]',
        border: 'border-[#FF2A3D]/40',
      };
    case 'leve':
      return {
        bg: 'bg-[#00FF66]/10',
        text: 'text-[#00FF66]',
        border: 'border-[#00FF66]/40',
      };
    case 'curto':
    default:
      return {
        bg: 'bg-[#8F9CA8]/10',
        text: 'text-[#8F9CA8]',
        border: 'border-[#8F9CA8]/40',
      };
  }
}

/**
 * Calculate week number of the year
 */
export function getWeekNumber(date: Date | string = new Date()): number {
  const d = typeof date === 'string' ? parseISODate(date) : new Date(date);
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Format duration minutes into hh:mm or mm min
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return '-';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins > 0 ? `${mins}m` : ''}`.trim();
  }
  return `${mins} min`;
}

/**
 * Calculate pace in min/km from distance and duration
 */
export function calculatePace(distanceKm: number, durationMin: number | null | undefined): string {
  if (!distanceKm || !durationMin || distanceKm <= 0) return '-';
  const paceDecimal = durationMin / distanceKm;
  const paceMin = Math.floor(paceDecimal);
  const paceSec = Math.round((paceDecimal - paceMin) * 60);
  return `${paceMin}:${paceSec.toString().padStart(2, '0')} /km`;
}
