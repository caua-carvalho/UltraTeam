/**
 * Get Monday of the current week in YYYY-MM-DD format
 */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Get Sunday of the current week in YYYY-MM-DD format
 */
export function getWeekEnd(date: Date = new Date()): string {
  const mondayStr = getWeekStart(date);
  const monday = new Date(mondayStr);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday.toISOString().split('T')[0];
}

/**
 * Format date for display (e.g., "18 SET")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = dateString.includes('T') ? new Date(dateString) : new Date(`${dateString}T12:00:00`);
  return date
    .toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
    .replace('.', '')
    .toUpperCase();
}

/**
 * Format full date with day of week (e.g., "SEG, 18 SET")
 */
export function formatFullDate(dateString: string): string {
  if (!dateString) return '';
  const date = dateString.includes('T') ? new Date(dateString) : new Date(`${dateString}T12:00:00`);
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
export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
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
