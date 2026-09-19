import {
  getWeekStart,
  getWeekEnd,
  addWeeks,
  addDays,
  isDateInWeek,
  getWeekDays,
  formatLocalDateToISO,
  parseISODate,
  formatDate,
  formatFullDate,
  getWeekNumber,
} from '../lib/utils';
import { PlanningService } from '../lib/planningService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}

console.log('=== RUNNING ULTRA-TEAM PLANNING & DATE SUITE ===\n');

// 1. Test Monday-Sunday Week Calculations
console.log('--- 1. Week Start (Monday) & Week End (Sunday) ---');
// 2026-09-18 is Friday
assert(getWeekStart('2026-09-18') === '2026-09-14', '2026-09-18 (Fri) week start must be 2026-09-14 (Mon)');
assert(getWeekEnd('2026-09-18') === '2026-09-20', '2026-09-18 (Fri) week end must be 2026-09-20 (Sun)');

// 2026-09-14 is Monday
assert(getWeekStart('2026-09-14') === '2026-09-14', '2026-09-14 (Mon) week start must be 2026-09-14');
assert(getWeekEnd('2026-09-14') === '2026-09-20', '2026-09-14 (Mon) week end must be 2026-09-20');

// 2026-09-20 is Sunday
assert(getWeekStart('2026-09-20') === '2026-09-14', '2026-09-20 (Sun) week start must be 2026-09-14');
assert(getWeekEnd('2026-09-20') === '2026-09-20', '2026-09-20 (Sun) week end must be 2026-09-20');

// 2. Test Year Rollover
console.log('\n--- 2. Year Rollover Tests ---');
// 2026-12-31 is Thursday
assert(getWeekStart('2026-12-31') === '2026-12-28', '2026-12-31 week start is 2026-12-28 (Mon)');
assert(getWeekEnd('2026-12-31') === '2027-01-03', '2026-12-31 week end is 2027-01-03 (Sun)');
assert(getWeekStart('2027-01-01') === '2026-12-28', '2027-01-01 week start is 2026-12-28 (Mon)');
assert(getWeekEnd('2027-01-01') === '2027-01-03', '2027-01-01 week end is 2027-01-03 (Sun)');

// 3. Test Month Rollover
console.log('\n--- 3. Month Rollover Tests ---');
// 2026-08-31 is Monday
assert(getWeekStart('2026-08-31') === '2026-08-31', '2026-08-31 is Mon -> start is 2026-08-31');
assert(getWeekEnd('2026-08-31') === '2026-09-06', '2026-08-31 week end is 2026-09-06 (Sun)');
assert(getWeekStart('2026-09-01') === '2026-08-31', '2026-09-01 (Tue) week start is 2026-08-31');

// 4. Test isDateInWeek Boundaries
console.log('\n--- 4. Date in Week Boundary Validation ---');
const wStart = '2026-09-14';
const wEnd = '2026-09-20';
assert(isDateInWeek('2026-09-14', wStart, wEnd) === true, 'Monday 2026-09-14 is inside week');
assert(isDateInWeek('2026-09-17', wStart, wEnd) === true, 'Thursday 2026-09-17 is inside week');
assert(isDateInWeek('2026-09-20', wStart, wEnd) === true, 'Sunday 2026-09-20 is inside week');
assert(isDateInWeek('2026-09-13', wStart, wEnd) === false, 'Previous Sunday 2026-09-13 is outside week');
assert(isDateInWeek('2026-09-21', wStart, wEnd) === false, 'Next Monday 2026-09-21 is outside week');

// 5. Test Navigation (addWeeks)
console.log('\n--- 5. Period Navigation & Weeks Calculations ---');
assert(addWeeks('2026-09-14', 1) === '2026-09-21', 'Adding 1 week to 2026-09-14 yields 2026-09-21');
assert(addWeeks('2026-09-14', 4) === '2026-10-12', 'Adding 4 weeks to 2026-09-14 yields 2026-10-12');
assert(addWeeks('2026-09-14', -1) === '2026-09-07', 'Subtracting 1 week from 2026-09-14 yields 2026-09-07');
assert(addWeeks('2026-09-14', -4) === '2026-08-17', 'Subtracting 4 weeks from 2026-09-14 yields 2026-08-17');

// 6. Test 7-days breakdown
console.log('\n--- 6. 7-Days Grid Generator ---');
const days = getWeekDays('2026-09-14');
assert(days.length === 7, 'Must generate exactly 7 days');
assert(days[0].dayName === 'SEG' && days[0].dateStr === '2026-09-14', 'Day 0 is Monday (SEG)');
assert(days[6].dayName === 'DOM' && days[6].dateStr === '2026-09-20', 'Day 6 is Sunday (DOM)');

// 7. Test Mission Date Validation logic
console.log('\n--- 7. PlanningService Validation Logic ---');
const outOfBoundsDate = '2026-09-25';
const scheduledWeekStart = getWeekStart(outOfBoundsDate);
const scheduledWeekEnd = getWeekEnd(outOfBoundsDate);
assert(isDateInWeek(outOfBoundsDate, '2026-09-14', '2026-09-20') === false, 'Date 2026-09-25 rejected for week 2026-09-14');
assert(scheduledWeekStart === '2026-09-21' && scheduledWeekEnd === '2026-09-27', 'Date 2026-09-25 correctly maps to week 2026-09-21');

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
