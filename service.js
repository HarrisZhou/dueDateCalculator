const WORKING_HOURS_START = 9;
const WORKING_HOURS_END = 17;

/**
 * Check if a date obj falls on a weekend
 *
 * @param {Date} date - The input date obj
 * @returns {boolean} - Whether it is a weekend.
 */
function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6;
}

/**
 * Move a date obj to next working day
 *
 * @param {Date} date - The input date obj
 * @returns {void} - This function does not return a value.
 */
function moveToNextWorkingDay(date) {
  //
  date.setDate(date.getDate() + 1);
  while (isWeekend(date)) {
    date.setDate(date.getDate() + 1);
  }
  date.setHours(WORKING_HOURS_START, 0, 0, 0);
}

/**
 * Convert a Date obj to ISO string in local timezone
 *
 * @param {Date} date - The input date obj
 * @returns {string} - ISO string in local timezone.
 */
function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Check if a date string can be converted to a valid Date obj
 *
 * @param {string} date - The input date string
 * @returns {boolean} - Whether input string can be cast into Date Obj.
 */
function isDate(date) {
  return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

/**
 * Calculate the due date based on submitted time and turn around time
 *
 * @param {string} submittedDateTime - The submitted date string
 * @param {number} turnAroundTime - The turn around time in hours
 * @returns {string} - Due date in local timezone.
 * TODO add caching
 */
function calculateDueDate(submittedDateTime, turnAroundTime) {
  // validate submittedDateTime
  if (!isDate(submittedDateTime)) {
    throw new Error("Invalid submitDateTime: Must be a valid timestamp for JavaScript Date object.");
  }

  // validate turnAroundTime
  if (typeof turnAroundTime !== "number" || turnAroundTime <= 0) {
    throw new Error("Invalid turnAroundTime: Must be a positive number.");
  }

  const resultDateTime = new Date(submittedDateTime);

  // handle cases when the submit time is outside working hours
  const submittedHour = resultDateTime.getHours();
  if (submittedHour < WORKING_HOURS_START || submittedHour >= WORKING_HOURS_END || isWeekend(resultDateTime)) {
    throw new Error("Submit date/time must be during working hours (Monday to Friday, 9 AM to 5 PM).");
  }

  // calculate remaining time
  let remainingTime = turnAroundTime;
  while (remainingTime > 0) {
    const endOfWorkday = new Date(resultDateTime);
    endOfWorkday.setHours(WORKING_HOURS_END, 0, 0, 0)
    const hoursUntilEndOfDay = (endOfWorkday - resultDateTime) / (1000 * 60 * 60)

    if (remainingTime <= hoursUntilEndOfDay) {
      const fractionalPart = remainingTime % 1; // Get the decimal part of remaining hours
      const integerPart = Math.floor(remainingTime);
      if (integerPart > 0) {
        resultDateTime.setHours(resultDateTime.getHours() + integerPart);
        remainingTime -= integerPart;
      }

      if (fractionalPart > 0) {
        resultDateTime.setMinutes(resultDateTime.getMinutes() + fractionalPart * 60);
        remainingTime -= fractionalPart;
      }
    } else {
      remainingTime -= hoursUntilEndOfDay;
      moveToNextWorkingDay(resultDateTime);
    }
  }
  return formatDateToISO(resultDateTime)
}
module.exports = calculateDueDate
