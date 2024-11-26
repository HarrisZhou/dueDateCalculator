const calculateDueDate = require('../service')

describe('calculateDueDate Function Tests', () => {
  test('Invalid submit time (outside working hours)', () => {
    const submittedDateTime = "2024-11-25T18:00:00"; // Monday, 6:00 PM (outside working hours)
    const turnAroundTime = 4; // 4 hours turnaround
    expect(() => calculateDueDate(submittedDateTime, turnAroundTime)).toThrow(
      "Submit date/time must be during working hours (Monday to Friday, 9 AM to 5 PM)."
    );
  });
  test('Invalid submit time', () => {
    const submittedDateTime = "2024-11-25T09"; // Monday, 6:00 PM (outside working hours)
    const turnAroundTime = 4; // 4 hours turnaround
    expect(() => calculateDueDate(submittedDateTime, turnAroundTime)).toThrow(
      "Invalid submitDateTime: Must be a valid timestamp for JavaScript Date object."
    );
  });
  test('Invalid turnAroundTime', () => {
    const submittedDateTime = "2024-11-25T18:00:00"; // Monday, 6:00 PM (outside working hours)
    const turnAroundTime = -4; // 4 hours turnaround
    expect(() => calculateDueDate(submittedDateTime, turnAroundTime)).toThrow(
      "Invalid turnAroundTime: Must be a positive number."
    );
  });

  test('Basic scenario within the same day', () => {
    const submittedDateTime = "2024-11-25T10:00:00"; // Monday, 10:00 AM
    const turnAroundTime = 4; // 4 hours turnaround
    const expectedDueDate = "2024-11-25T14:00:00"; // Same day, 2:00 PM
    const actualDueDate = calculateDueDate(submittedDateTime, turnAroundTime);
    expect(actualDueDate).toBe(expectedDueDate);
  });
  test('Basic scenario within the same day with float turnAroundTime', () => {
    const submittedDateTime = "2024-11-25T10:00:00"; // Monday, 10:00 AM
    const turnAroundTime = 4.5; // 4.5 hours turnaround
    const expectedDueDate = "2024-11-25T14:30:00"; // Same day, 2:30 PM
    const actualDueDate = calculateDueDate(submittedDateTime, turnAroundTime);
    expect(actualDueDate).toBe(expectedDueDate);
  });

  test('Spanning multiple working days', () => {
    const submittedDateTime = "2024-11-25T10:00:00"; // Monday, 10:00 AM
    const turnAroundTime = 16; // 16 hours turnaround
    const expectedDueDate = "2024-11-27T10:00:00"; // Wednesday, 10:00 AM
    const actualDueDate = calculateDueDate(submittedDateTime, turnAroundTime);
    expect(actualDueDate).toBe(expectedDueDate);
  });

  test('Spanning over a weekend', () => {
    const submittedDateTime = "2024-11-22T15:00:00"; // Friday, 3:00 PM
    const turnAroundTime = 10; // 10 hours turnaround
    const expectedDueDate = "2024-11-25T17:00:00"; // Monday, 5:00 PM
    const actualDueDate = calculateDueDate(submittedDateTime, turnAroundTime);
    expect(actualDueDate).toBe(expectedDueDate);
  });

  test('Test with a float turnAroundTime', () => {
    const submittedDateTime = "2024-11-22T15:00:00"; // Friday, 3:00 PM
    const turnAroundTime = 5.5; // 5.5 hours turnaround
    const expectedDueDate = "2024-11-25T12:30:00"; // Monday, 12:30 PM
    const actualDueDate = calculateDueDate(submittedDateTime, turnAroundTime);
    expect(actualDueDate).toBe(expectedDueDate);
  });

  test('Test with a large turnAroundTime', () => {
    const submittedDateTime = "2024-11-25T09:00:00";
    const turnAroundTime = 10000;
    const expectedDueDate = "2029-09-07T17:00:00";
    const actualDueDate = calculateDueDate(submittedDateTime, turnAroundTime);
    expect(actualDueDate).toBe(expectedDueDate);
  });

});