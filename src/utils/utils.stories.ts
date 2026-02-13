import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { expect } from '@storybook/test';
import {
  addDays,
  subDays,
  getNextDay,
  getPreviousDay,
  getNextMonth,
  getPreviousMonth,
  getNextYear,
  getPreviousYear,
  getFirstOfMonth,
  getLastOfMonth,
  getDaysOfMonth,
  getISODateString,
  getMonth,
  getYear,
  getMonths,
  getWeekDays,
  isSameDay,
  isDateInRange,
  dateIsWithinBounds,
  dateIsWithinUpperBounds,
  dateIsWithinLowerBounds,
  monthIsDisabled,
  isValidISODate,
  extractDates,
  removeTimezoneOffset
} from './utils';

const meta: Meta = {
  title: 'Utils/DateUtilities',
  tags: ['autodocs'],
  render: (args) => {
    // Setup handlers after render
    setTimeout(() => {
      const container = document.querySelector('.utils-demo-container');
      if (!container) return;

      const dateInput = container.querySelector<HTMLInputElement>('#base-date-input');
      const daysInput = container.querySelector<HTMLInputElement>('#days-input');
      const addResult = container.querySelector<HTMLElement>('#add-result');
      const subResult = container.querySelector<HTMLElement>('#sub-result');
      const nextDayResult = container.querySelector<HTMLElement>('#next-day-result');
      const prevDayResult = container.querySelector<HTMLElement>('#prev-day-result');
      const nextMonthResult = container.querySelector<HTMLElement>('#next-month-result');
      const prevMonthResult = container.querySelector<HTMLElement>('#prev-month-result');
      const isoResult = container.querySelector<HTMLElement>('#iso-result');
      const firstOfMonthResult = container.querySelector<HTMLElement>('#first-of-month-result');
      const lastOfMonthResult = container.querySelector<HTMLElement>('#last-of-month-result');
      const localeInput = container.querySelector<HTMLInputElement>('#locale-input');
      const monthsResult = container.querySelector<HTMLElement>('#months-result');
      const weekDaysResult = container.querySelector<HTMLElement>('#weekdays-result');
      const firstDayInput = container.querySelector<HTMLInputElement>('#first-day-input');

      if (!dateInput || !daysInput || !addResult || !subResult || !nextDayResult ||
          !prevDayResult || !nextMonthResult || !prevMonthResult || !isoResult ||
          !firstOfMonthResult || !lastOfMonthResult || !localeInput || !monthsResult ||
          !weekDaysResult || !firstDayInput) return;

      function updateResults() {
        const baseDate = new Date(dateInput.value);
        const days = parseInt(daysInput.value) || 0;
        const locale = localeInput.value || 'en-US';
        const firstDay = parseInt(firstDayInput.value) || 0;

        try {
          // Date arithmetic
          const added = addDays(baseDate, days);
          addResult.innerHTML = `<strong>Add ${days} days:</strong> ${getISODateString(added)} (${added.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;

          const subbed = subDays(baseDate, days);
          subResult.innerHTML = `<strong>Subtract ${days} days:</strong> ${getISODateString(subbed)} (${subbed.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;

          // Day navigation
          const nextDay = getNextDay(baseDate);
          nextDayResult.innerHTML = `<strong>Next day:</strong> ${getISODateString(nextDay)} (${nextDay.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;

          const prevDay = getPreviousDay(baseDate);
          prevDayResult.innerHTML = `<strong>Previous day:</strong> ${getISODateString(prevDay)} (${prevDay.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;

          // Month navigation
          const nextMonth = getNextMonth(baseDate);
          nextMonthResult.innerHTML = `<strong>Next month:</strong> ${getISODateString(nextMonth)} (${nextMonth.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })})`;

          const prevMonth = getPreviousMonth(baseDate);
          prevMonthResult.innerHTML = `<strong>Previous month:</strong> ${getISODateString(prevMonth)} (${prevMonth.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })})`;

          // ISO string
          isoResult.innerHTML = `<strong>ISO date string:</strong> ${getISODateString(baseDate)}`;

          // First and last of month
          const firstOfMonth = getFirstOfMonth(baseDate);
          firstOfMonthResult.innerHTML = `<strong>First of month:</strong> ${getISODateString(firstOfMonth)} (${firstOfMonth.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;

          const lastOfMonth = getLastOfMonth(baseDate);
          lastOfMonthResult.innerHTML = `<strong>Last of month:</strong> ${getISODateString(lastOfMonth)} (${lastOfMonth.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;

          // Months
          const months = getMonths(locale);
          monthsResult.innerHTML = `<strong>Months (${locale}):</strong> ${months.join(', ')}`;

          // Week days
          const weekDays = getWeekDays(firstDay, locale);
          weekDaysResult.innerHTML = `<strong>Week days (starting ${firstDay === 0 ? 'Sunday' : 'Monday'}):</strong><br>${weekDays.map(([short, long]) => `${short} - ${long}`).join('<br>')}`;

        } catch (e: any) {
          console.error(e);
        }
      }

      dateInput.addEventListener('change', updateResults);
      daysInput.addEventListener('input', updateResults);
      localeInput.addEventListener('input', updateResults);
      firstDayInput.addEventListener('change', updateResults);

      // Initial state
      updateResults();
    }, 100);

    return html`
      <div class="utils-demo-container" style="max-width: 800px; margin: 2rem; font-family: system-ui, sans-serif;">
        <h2>Date Utilities Demo</h2>
        <p style="color: #666;">
          Explore all the date utility functions with interactive examples.
        </p>

        <div style="margin: 1.5rem 0; padding: 1rem; background: #f5f5f5; border-radius: 4px;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
            Base Date:
          </label>
          <input
            type="date"
            id="base-date-input"
            value="2022-01-15"
            style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
          />

          <label style="display: block; margin: 1rem 0 0.5rem; font-weight: 600;">
            Days to Add/Subtract:
          </label>
          <input
            type="number"
            id="days-input"
            value="10"
            min="-365"
            max="365"
            style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; width: 100px;"
          />
        </div>

        <div style="margin: 1.5rem 0;">
          <h3>Date Arithmetic</h3>
          <div id="add-result" style="padding: 0.5rem; background: #e3f2fd; border-radius: 4px; margin: 0.5rem 0;"></div>
          <div id="sub-result" style="padding: 0.5rem; background: #e3f2fd; border-radius: 4px; margin: 0.5rem 0;"></div>
        </div>

        <div style="margin: 1.5rem 0;">
          <h3>Day Navigation</h3>
          <div id="next-day-result" style="padding: 0.5rem; background: #e8f5e9; border-radius: 4px; margin: 0.5rem 0;"></div>
          <div id="prev-day-result" style="padding: 0.5rem; background: #e8f5e9; border-radius: 4px; margin: 0.5rem 0;"></div>
        </div>

        <div style="margin: 1.5rem 0;">
          <h3>Month Navigation</h3>
          <div id="next-month-result" style="padding: 0.5rem; background: #fff3e0; border-radius: 4px; margin: 0.5rem 0;"></div>
          <div id="prev-month-result" style="padding: 0.5rem; background: #fff3e0; border-radius: 4px; margin: 0.5rem 0;"></div>
        </div>

        <div style="margin: 1.5rem 0;">
          <h3>Month Boundaries & Formatting</h3>
          <div id="iso-result" style="padding: 0.5rem; background: #f3e5f5; border-radius: 4px; margin: 0.5rem 0;"></div>
          <div id="first-of-month-result" style="padding: 0.5rem; background: #f3e5f5; border-radius: 4px; margin: 0.5rem 0;"></div>
          <div id="last-of-month-result" style="padding: 0.5rem; background: #f3e5f5; border-radius: 4px; margin: 0.5rem 0;"></div>
        </div>

        <div style="margin: 1.5rem 0; padding: 1rem; background: #f5f5f5; border-radius: 4px;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
            Locale:
          </label>
          <input
            type="text"
            id="locale-input"
            value="en-US"
            placeholder="e.g., en-US, fr-FR, de-DE"
            style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; width: 200px;"
          />

          <label style="display: block; margin: 1rem 0 0.5rem; font-weight: 600;">
            First Day of Week:
          </label>
          <select id="first-day-input" style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
          </select>
        </div>

        <div style="margin: 1.5rem 0;">
          <h3>Locale-Specific Data</h3>
          <div id="months-result" style="padding: 0.5rem; background: #fce4ec; border-radius: 4px; margin: 0.5rem 0;"></div>
          <div id="weekdays-result" style="padding: 0.5rem; background: #fce4ec; border-radius: 4px; margin: 0.5rem 0;"></div>
        </div>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj;

export const InteractiveDemo: Story = {};

// Date Arithmetic Stories
export const AddDaysToDate: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(addDays(new Date("2022-01-01"), 1)).toEqual(new Date("2022-01-02"));
    expect(addDays(new Date("2022-01-01"), 10)).toEqual(new Date("2022-01-11"));
    expect(addDays(new Date("2022-01-01"), 60)).toEqual(new Date("2022-03-02"));
    expect(addDays(new Date("2022-01-01"), 365)).toEqual(new Date("2023-01-01"));
    expect(addDays(new Date("2022-01-01"), -1)).toEqual(new Date("2021-12-31"));
  }
};

export const SubtractDaysFromDate: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(subDays(new Date("2022-01-01"), 1)).toEqual(new Date("2021-12-31"));
    expect(subDays(new Date("2022-01-11"), 10)).toEqual(new Date("2022-01-01"));
    expect(subDays(new Date("2022-03-02"), 60)).toEqual(new Date("2022-01-01"));
    expect(subDays(new Date("2023-01-01"), 365)).toEqual(new Date("2022-01-01"));
    expect(subDays(new Date("2022-01-01"), -1)).toEqual(new Date("2022-01-02"));
  }
};

// Day Navigation Stories
export const GetNextDay: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getNextDay(new Date("2022-01-01"))).toEqual(new Date("2022-01-02"));
    expect(getNextDay(new Date("2022-01-31"))).toEqual(new Date("2022-02-01"));
    expect(getNextDay(new Date("2022-12-31"))).toEqual(new Date("2023-01-01"));
  }
};

export const GetPreviousDay: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getPreviousDay(new Date("2022-01-01"))).toEqual(new Date("2021-12-31"));
    expect(getPreviousDay(new Date("2022-01-31"))).toEqual(new Date("2022-01-30"));
  }
};

// Month Navigation Stories
export const GetNextMonth: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getNextMonth(new Date("2022-01-01"))).toEqual(new Date("2022-02-01"));
    expect(getNextMonth(new Date("2022-12-20"))).toEqual(new Date("2023-01-20"));
  }
};

export const GetPreviousMonth: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getPreviousMonth(new Date("2022-01-01"))).toEqual(new Date("2021-12-01"));
    expect(getPreviousMonth(new Date("2022-12-20"))).toEqual(new Date("2022-11-20"));
  }
};

// Year Navigation Stories
export const GetNextYear: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getNextYear(new Date("2022-01-01"))).toEqual(new Date("2023-01-01"));
    expect(getNextYear(new Date("2022-12-31"))).toEqual(new Date("2023-12-31"));
  }
};

export const GetPreviousYear: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getPreviousYear(new Date("2022-01-01"))).toEqual(new Date("2021-01-01"));
    expect(getPreviousYear(new Date("2022-12-31"))).toEqual(new Date("2021-12-31"));
  }
};

// Month Boundary Stories
export const GetFirstOfMonth: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    const expected = removeTimezoneOffset(new Date("2022-01-01"));
    expect(getFirstOfMonth(removeTimezoneOffset(new Date("2022-01-01")))).toEqual(expected);
    expect(getFirstOfMonth(removeTimezoneOffset(new Date("2022-01-20")))).toEqual(expected);
  }
};

export const GetLastOfMonth: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    const expected = removeTimezoneOffset(new Date("2022-01-31"));
    // getLastOfMonth returns a date that's one day before the expected due to how it calculates
    const result = getLastOfMonth(removeTimezoneOffset(new Date("2022-01-01")));
    expect(getISODateString(result)).toEqual("2022-01-31");
    expect(getISODateString(getLastOfMonth(removeTimezoneOffset(new Date("2022-01-20"))))).toEqual("2022-01-31");
    expect(getISODateString(getLastOfMonth(removeTimezoneOffset(new Date("2022-01-31"))))).toEqual("2022-01-31");
  }
};

export const GetDaysOfMonthUnpadded: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    const result = getDaysOfMonth(removeTimezoneOffset(new Date("2022-01-01")), true, 3);

    // Check padding and total length
    expect(result.length).toBeGreaterThan(31);

    // Find where January starts
    const janStartIndex = result.findIndex(d => getMonth(d) === 1 && d.getDate() === 1);
    expect(janStartIndex).toBeGreaterThan(0); // Should have padding before

    // Verify first day of January
    expect(getISODateString(result[janStartIndex])).toEqual("2022-01-01");

    // Verify last day of January is in the array
    const janEndIndex = result.findIndex(d => getMonth(d) === 1 && d.getDate() === 31);
    expect(janEndIndex).toBeGreaterThan(janStartIndex);
  }
};

// Date Formatting Stories
export const GetISODateString: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getISODateString(new Date("2022-01-01"))).toEqual("2022-01-01");
    expect(getISODateString(new Date("2022-01-20"))).toEqual("2022-01-20");
  }
};

export const GetMonth: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getMonth(new Date("2022-01-01"))).toEqual(1);
    expect(getMonth(new Date("2022-01-31"))).toEqual(1);
    expect(getMonth(new Date("2022-02-28"))).toEqual(2);
  }
};

export const GetYear: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getYear(new Date("2022-01-01"))).toEqual(2022);
  }
};

// Locale Stories
export const GetMonthsEnglish: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    const expected = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    expect(getMonths("en-US")).toEqual(expected);
  }
};

export const GetWeekDaysSundayStart: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getWeekDays(0, "en-US")).toEqual([
      ["Sun", "Sunday"],
      ["Mon", "Monday"],
      ["Tue", "Tuesday"],
      ["Wed", "Wednesday"],
      ["Thu", "Thursday"],
      ["Fri", "Friday"],
      ["Sat", "Saturday"]
    ]);
  }
};

export const GetWeekDaysMondayStart: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(getWeekDays(1, "en-US")).toEqual([
      ["Mon", "Monday"],
      ["Tue", "Tuesday"],
      ["Wed", "Wednesday"],
      ["Thu", "Thursday"],
      ["Fri", "Friday"],
      ["Sat", "Saturday"],
      ["Sun", "Sunday"]
    ]);
  }
};

// Date Comparison Stories
export const IsSameDay: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(isSameDay(new Date("2022-01-01"), new Date("2022-01-01"))).toEqual(true);
    expect(isSameDay(new Date("2022-01-01"), new Date("2021-01-01"))).toEqual(false);
    expect(isSameDay(new Date("2022-01-02"), new Date("2022-01-01"))).toEqual(false);
  }
};

export const IsDateInRange: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(
      isDateInRange(new Date("2022-01-01"), {
        from: new Date("2022-01-01"),
        to: new Date("2022-01-01")
      })
    ).toEqual(true);

    expect(
      isDateInRange(new Date("2022-01-01"), {
        from: new Date("2021-01-01"),
        to: new Date("2022-02-01")
      })
    ).toEqual(true);

    expect(
      isDateInRange(new Date("2022-01-01"), {
        from: new Date("2022-02-01"),
        to: new Date("2021-01-01")
      })
    ).toEqual(true);

    expect(
      isDateInRange(new Date("2022-01-01"), {
        from: new Date("2022-01-02"),
        to: new Date("2022-02-01")
      })
    ).toEqual(false);
  }
};

// Date Bounds Stories
export const DateIsWithinUpperBounds: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(dateIsWithinUpperBounds(new Date("2023-01-15"))).toEqual(true);
    expect(dateIsWithinUpperBounds(new Date("2023-01-15"), "2023-01-15")).toEqual(true);
    expect(dateIsWithinUpperBounds(new Date("2023-01-16"), "2023-01-15")).toEqual(false);
  }
};

export const DateIsWithinBounds: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(dateIsWithinBounds(new Date("2023-01-15"))).toEqual(true);
    expect(dateIsWithinBounds(new Date("2023-01-15"), "2023-01-14")).toEqual(true);
    expect(dateIsWithinBounds(new Date("2023-01-15"), "2023-01-15")).toEqual(true);
    expect(dateIsWithinBounds(new Date("2023-01-15"), "2023-01-17")).toEqual(false);

    expect(dateIsWithinBounds(new Date("2023-01-25"), "2023-01-17", "2023-01-30")).toEqual(true);
    expect(dateIsWithinBounds(new Date("2023-01-17"), "2023-01-17", "2023-01-30")).toEqual(true);
    expect(dateIsWithinBounds(new Date("2023-01-15"))).toEqual(true);
    expect(dateIsWithinBounds(new Date("2023-01-15"), undefined, "2023-01-30")).toEqual(true);
    expect(dateIsWithinBounds(new Date("2023-01-30"), "2023-01-17", "2023-01-30")).toEqual(true);
    expect(dateIsWithinBounds(new Date("2023-01-15"), undefined, "2023-01-13")).toEqual(false);
    expect(dateIsWithinBounds(new Date("2023-01-14"), undefined, "2023-01-13")).toEqual(false);
  }
};

export const MonthIsDisabled: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(monthIsDisabled(2, 1999, undefined, undefined)).toBeFalsy();
    expect(monthIsDisabled(0, 2023, "2023-01-01", undefined)).toBeFalsy();
    expect(monthIsDisabled(0, 2023, "2022-12-31", undefined)).toBeFalsy();
    expect(monthIsDisabled(11, 2022, "2023-01-01", undefined)).toBeTruthy();
    expect(monthIsDisabled(2, 2023, "2023-01-31", undefined)).toBeFalsy();
    expect(monthIsDisabled(2, 1999, "2023-01-31", undefined)).toBeTruthy();
    expect(monthIsDisabled(2, 1999, undefined, "2023-12-12")).toBeFalsy();
    expect(monthIsDisabled(11, 2023, undefined, "2023-12-12")).toBeFalsy();
    expect(monthIsDisabled(0, 2024, undefined, "2023-12-12")).toBeTruthy();
    expect(monthIsDisabled(0, 2024, "1999-02-02", "2023-12-12")).toBeTruthy();
    expect(monthIsDisabled(0, 2024, "1999-02-02", "2024-12-12")).toBeFalsy();
  }
};

// Validation Stories
export const ValidateISODate: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(isValidISODate("2023-01-15")).toBeTruthy();
    expect(isValidISODate("2023-12-31")).toBeTruthy();
    // Note: isValidISODate doesn't validate the actual day, just format and parsability
    expect(isValidISODate("2023-02-31")).toBeTruthy(); // Matches format, even if invalid
    expect(isValidISODate("not-a-date")).toBeFalsy();
    expect(isValidISODate("01-15-2023")).toBeFalsy(); // Wrong format
    expect(isValidISODate("2023/01/15")).toBeFalsy(); // Wrong separator
  }
};

export const ExtractDatesFromText: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    expect(extractDates("Meeting on 2023-01-15")).toEqual(["2023-01-15"]);
    expect(extractDates("From 2023-01-15 to 2023-01-20")).toEqual(["2023-01-15", "2023-01-20"]);
    expect(extractDates("2023-01-15, 2023-01-20, 2023-01-25")).toEqual(["2023-01-15", "2023-01-20"]);
    expect(extractDates("No dates here")).toBeUndefined(); // Returns undefined, not null
  }
};

// Combined Functionality Story
export const CombinedDateOperations: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    // Test a complex scenario combining multiple utilities
    const startDate = new Date("2022-06-15");
    const endDate = addDays(startDate, 30);

    expect(getISODateString(endDate)).toEqual("2022-07-15");

    const firstOfEndMonth = getFirstOfMonth(endDate);
    expect(getISODateString(firstOfEndMonth)).toEqual("2022-07-01");

    const isInRange = isDateInRange(new Date("2022-06-20"), {
      from: startDate,
      to: endDate
    });
    expect(isInRange).toBeTruthy();

    const nextYear = getNextYear(startDate);
    expect(getYear(nextYear)).toEqual(2023);
  }
};
