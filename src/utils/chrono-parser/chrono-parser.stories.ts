import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { chronoParseDate, chronoParseRange } from './chrono-parser';
import { within, expect, waitFor, fireEvent } from '@storybook/test';
import { isSameDay } from '../utils';

const meta: Meta = {
  title: 'Utils/ChronoParser',
  tags: ['autodocs'],
  render: (args) => {
    // Setup handlers after render
    setTimeout(() => {
      const container = document.querySelector('.chrono-demo-container');
      if (!container) return;

      const dateInput = container.querySelector<HTMLInputElement>('#date-input');
      const rangeInput = container.querySelector<HTMLInputElement>('#range-input');
      const dateResult = container.querySelector<HTMLElement>('#date-result');
      const rangeResult = container.querySelector<HTMLElement>('#range-result');
      const strictMode = container.querySelector<HTMLInputElement>('#strict-mode');
      const referenceDate = container.querySelector<HTMLInputElement>('#reference-date');

      if (!dateInput || !rangeInput || !dateResult || !rangeResult || !strictMode || !referenceDate) return;

      async function updateDateResult() {
        const value = dateInput.value;
        if (!value) {
          dateResult.textContent = 'Enter a date to parse...';
          dateResult.style.color = '';
          return;
        }

        try {
          const options = {
            referenceDate: new Date(referenceDate.value),
            useStrict: strictMode.checked
          };

          const result = await chronoParseDate(value, options);

          if (result?.value) {
            dateResult.innerHTML = `<strong>✓ Parsed:</strong> ${result.value.toISOString().split('T')[0]} (${result.value.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;
            dateResult.style.color = '#2e7d32';
          } else if (result?.reason) {
            dateResult.innerHTML = `<strong>✗ Error:</strong> ${result.reason}`;
            dateResult.style.color = '#c62828';
          } else {
            dateResult.innerHTML = '<strong>✗</strong> Could not parse date';
            dateResult.style.color = '#c62828';
          }
        } catch (e: any) {
          dateResult.innerHTML = `<strong>✗ Error:</strong> ${e.message}`;
          dateResult.style.color = '#c62828';
        }
      }

      async function updateRangeResult() {
        const value = rangeInput.value;
        if (!value) {
          rangeResult.textContent = 'Enter a date range to parse...';
          rangeResult.style.color = '';
          return;
        }

        try {
          const options = {
            referenceDate: new Date(referenceDate.value),
            useStrict: strictMode.checked
          };

          const result = await chronoParseRange(value, options);

          if (result?.value?.start) {
            const startStr = result.value.start.toISOString().split('T')[0];
            const endStr = result.value.end ? result.value.end.toISOString().split('T')[0] : 'No end date';
            rangeResult.innerHTML = `<strong>✓ Parsed:</strong> ${startStr} to ${endStr}`;
            rangeResult.style.color = '#2e7d32';
          } else if (result?.reason) {
            rangeResult.innerHTML = `<strong>✗ Error:</strong> ${result.reason}`;
            rangeResult.style.color = '#c62828';
          } else {
            rangeResult.innerHTML = '<strong>✗</strong> Could not parse range';
            rangeResult.style.color = '#c62828';
          }
        } catch (e: any) {
          rangeResult.innerHTML = `<strong>✗ Error:</strong> ${e.message}`;
          rangeResult.style.color = '#c62828';
        }
      }

      dateInput.addEventListener('input', updateDateResult);
      rangeInput.addEventListener('input', updateRangeResult);
      strictMode.addEventListener('change', () => {
        updateDateResult();
        updateRangeResult();
      });
      referenceDate.addEventListener('change', () => {
        updateDateResult();
        updateRangeResult();
      });

      // Initial state
      dateResult.textContent = 'Enter a date to parse...';
      rangeResult.textContent = 'Enter a date range to parse...';
    }, 100);

    return html`
      <div class="chrono-demo-container" style="max-width: 600px; margin: 2rem; font-family: system-ui, sans-serif;">
        <h2>Chrono Date Parser Demo</h2>
        <p style="color: #666;">
          Try parsing dates with natural language. Examples: "tomorrow", "January 15", "in ten days"
        </p>

        <div style="margin: 1rem 0;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
            Single Date Parser:
          </label>
          <input
            type="text"
            id="date-input"
            placeholder="e.g., tomorrow"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
          />
          <div id="date-result" style="margin-top: 0.5rem; padding: 0.5rem; background: #f5f5f5; border-radius: 4px; min-height: 2rem;">Enter a date to parse...</div>
        </div>

        <div style="margin: 2rem 0;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
            Date Range Parser:
          </label>
          <input
            type="text"
            id="range-input"
            placeholder="e.g., from January 25 to January 30"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
          />
          <div id="range-result" style="margin-top: 0.5rem; padding: 0.5rem; background: #f5f5f5; border-radius: 4px; min-height: 2rem;">Enter a date range to parse...</div>
        </div>

        <div style="margin: 2rem 0; padding: 1rem; background: #e3f2fd; border-radius: 4px;">
          <h3 style="margin-top: 0;">Options:</h3>
          <label style="display: block; margin: 0.5rem 0;">
            <input type="checkbox" id="strict-mode" />
            Use Strict Mode (only accepts specific date formats)
          </label>
          <label style="display: block; margin: 0.5rem 0;">
            Reference Date:
            <input
              type="date"
              id="reference-date"
              value="2023-01-11"
              style="margin-left: 0.5rem; padding: 0.25rem;"
            />
          </label>
        </div>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj;

export const InteractiveDemo: Story = {};

export const ParseAbsoluteDatesEnglish: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    await correctlyParsesAbsoluteDatesInEnglish(canvasElement);
  }
};

export const ParseRelativeDatesEnglish: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    await correctlyParsesRelativeDatesInEnglish(canvasElement);
  }
};

export const ParseRangeDates: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    await canParseRangeDates(canvasElement);
  }
};

export const AdaptsToReferenceDates: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    await adaptsToReferenceDates(canvasElement);
  }
};

export const UseStrictMode: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    await canUseStrictMode(canvasElement);
  }
};

export const RespectsMinMaxDate: Story = {
  render: () => html`<div id="test-container"></div>`,
  play: async ({ canvasElement }) => {
    await respectsMinAndMaxDate(canvasElement);
  }
};

// Helper function
async function parseDateWithOptions(
  dateString: string,
  options?: any
) {
  if (!options)
    options = {
      referenceDate: new Date("2023-01-11")
    };
  const { referenceDate = new Date("2023-01-11") } = options;
  const parsedDate = await chronoParseDate(dateString, {
    referenceDate: referenceDate,
    ...options
  });
  return { value: parsedDate?.value, reason: parsedDate?.reason };
}

async function parseRangeWithOptions(
  dateString: string,
  options?: any
) {
  if (!options)
    options = {
      referenceDate: new Date("2023-01-11")
    };
  const { referenceDate = new Date("2023-01-11") } = options;
  const parsedRange = await chronoParseRange(dateString, {
    referenceDate: referenceDate,
    ...options
  });
  return { value: parsedRange?.value, reason: parsedRange?.reason };
}

// Play functions
async function correctlyParsesAbsoluteDatesInEnglish(canvasElement: HTMLElement) {
  let parsedDate = await parseDateWithOptions("January 15");
  expect(isSameDay(parsedDate?.value, new Date("2023-01-15"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("February tenth");
  expect(isSameDay(parsedDate?.value, new Date("2023-02-10"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("01-10-24");
  expect(isSameDay(parsedDate?.value, new Date("2024-01-10"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("01/10/24");
  expect(isSameDay(parsedDate?.value, new Date("2024-01-10"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("2024-01-10");
  expect(isSameDay(parsedDate?.value, new Date("2024-01-10"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("Twenty second of September");
  expect(isSameDay(parsedDate?.value, new Date("2023-09-22"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("June 1984");
  expect(isSameDay(parsedDate?.value, new Date("1984-06-01"))).toBeTruthy();

  parsedDate = await parseDateWithOptions(
    "I want to book a ticket on the tenth of september"
  );
  expect(isSameDay(parsedDate?.value, new Date("2023-09-10"))).toBeTruthy();
}

async function correctlyParsesRelativeDatesInEnglish(canvasElement: HTMLElement) {
  let parsedDate = await parseDateWithOptions("today");
  expect(isSameDay(parsedDate?.value, new Date("2023-01-11"))).toBeTruthy();
  expect(isSameDay(parsedDate?.value, new Date("2023-01-12"))).toBeFalsy();

  parsedDate = await parseDateWithOptions("tomorrow");
  expect(isSameDay(parsedDate?.value, new Date("2023-01-12"))).toBeTruthy();
  expect(isSameDay(parsedDate?.value, new Date("2023-01-11"))).toBeFalsy();

  parsedDate = await parseDateWithOptions("yesterday");
  expect(isSameDay(parsedDate?.value, new Date("2023-01-10"))).toBeTruthy();
  expect(isSameDay(parsedDate?.value, new Date("2023-01-11"))).toBeFalsy();

  parsedDate = await parseDateWithOptions("next year");
  expect(isSameDay(parsedDate?.value, new Date("2024-01-11"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("in ten days");
  expect(isSameDay(parsedDate?.value, new Date("2023-01-21"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("in ten years");
  expect(isSameDay(parsedDate?.value, new Date("2033-01-11"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("in eleven months");
  expect(isSameDay(parsedDate?.value, new Date("2023-12-11"))).toBeTruthy();
}

async function canParseRangeDates(canvasElement: HTMLElement) {
  let parsedRange = await parseRangeWithOptions(
    "from january 25 to january 30"
  );
  expect(
    isSameDay(parsedRange?.value?.start, new Date("2023-01-25"))
  ).toBeTruthy();
  expect(
    isSameDay(parsedRange?.value?.end, new Date("2023-01-30"))
  ).toBeTruthy();

  parsedRange = await parseRangeWithOptions("june 1984 - february 1990");
  expect(
    isSameDay(parsedRange?.value?.start, new Date("1984-06-01"))
  ).toBeTruthy();
  expect(
    isSameDay(parsedRange?.value?.end, new Date("1990-02-01"))
  ).toBeTruthy();

  parsedRange = await parseRangeWithOptions(
    "june second 2008 - june third 2008"
  );
  expect(
    isSameDay(parsedRange?.value?.start, new Date("2008-06-02"))
  ).toBeTruthy();
  expect(
    isSameDay(parsedRange?.value?.end, new Date("2008-06-03"))
  ).toBeTruthy();

  parsedRange = await parseRangeWithOptions("june second 2008");
  expect(
    isSameDay(parsedRange?.value?.start, new Date("2008-06-02"))
  ).toBeTruthy();
  expect(parsedRange?.value?.end).toBeNull();
}

async function adaptsToReferenceDates(canvasElement: HTMLElement) {
  let parsedDate = await parseDateWithOptions("today", {
    referenceDate: new Date("2023-02-02")
  });
  expect(isSameDay(parsedDate?.value, new Date("2023-02-02"))).toBeTruthy();
}

async function canUseStrictMode(canvasElement: HTMLElement) {
  let parsedDate = await parseDateWithOptions("today", { useStrict: true });
  expect(parsedDate?.value).toBeNull();
  expect(parsedDate?.reason).toEqual("invalid");

  parsedDate = await parseDateWithOptions("June eleven 1984", {
    useStrict: true
  });
  expect(parsedDate?.value).toBeNull();
  expect(parsedDate?.reason).toEqual("invalid");

  parsedDate = await parseDateWithOptions("Friday", {
    useStrict: true
  });
  expect(parsedDate?.value).toBeNull();
  expect(parsedDate?.reason).toEqual("invalid");

  parsedDate = await parseDateWithOptions("2023-02-01", {
    useStrict: true
  });
  expect(isSameDay(parsedDate?.value, new Date("2023-02-01"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("August 8 2004", {
    useStrict: true
  });
  expect(isSameDay(parsedDate?.value, new Date("2004-08-08"))).toBeTruthy();
}

async function respectsMinAndMaxDate(canvasElement: HTMLElement) {
  let parsedDate = await parseDateWithOptions("july 1999", {
    minDate: "2000-01-01",
    maxDate: "2030-12-31"
  });
  expect(parsedDate?.value).toBeNull();
  expect(parsedDate?.reason).toEqual("minDate");

  parsedDate = await parseDateWithOptions("in 50 years", {
    minDate: "2000-01-01",
    maxDate: "2030-12-31"
  });
  expect(parsedDate?.value).toBeNull();
  expect(parsedDate?.reason).toEqual("maxDate");

  parsedDate = await parseDateWithOptions("January 1 2000", {
    minDate: "2000-01-01",
    maxDate: "2030-12-31"
  });
  expect(isSameDay(parsedDate?.value, new Date("2000-01-01"))).toBeTruthy();

  parsedDate = await parseDateWithOptions("December 31 2030", {
    minDate: "2000-01-01",
    maxDate: "2030-12-31"
  });
  expect(isSameDay(parsedDate?.value, new Date("2030-12-31"))).toBeTruthy();
}
