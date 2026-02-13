import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { Components } from '../../components';
import { ifDefined } from 'lit/directives/if-defined.js';
import { expect, fireEvent, userEvent, waitFor, within } from '@storybook/test';

const commonArgs = {
  label: 'Choose a date',
}

const meta: Meta<Components.InclusiveDates> = {
  title: 'Components/InclusiveDates',
  tags: ['autodocs'],
  render: (args) => html`
    <inclusive-dates
      id=${args.id}
      .value=${ifDefined(args.value)}
      label=${ifDefined(args.label)}
      placeholder=${ifDefined(args.placeholder)}
      locale=${ifDefined(args.locale)}
      format=${ifDefined(args.format)}
      min-date=${ifDefined(args.minDate)}
      max-date=${ifDefined(args.maxDate)}
      start-date=${ifDefined(args.startDate)}
      reference-date=${ifDefined(args.referenceDate)}
      .quickButtons=${args.quickButtons}
      first-day-of-week=${ifDefined(args.firstDayOfWeek)}
      ?range=${args.range}
      ?show-quick-buttons=${args.showQuickButtons}
      ?disabled=${args.disabled}
      ?inline=${args.inline}
      ?show-year-stepper=${args.showYearStepper}
      show-month-stepper=${args.showMonthStepper}
      show-clear-button=${args.showClearButton}
      show-today-button=${args.showTodayButton}
      input-should-format=${args.formatInputOnAccept}

    ></inclusive-dates>
  `,
};

export default meta;
type Story = StoryObj<Components.InclusiveDates>;

export const Default: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-default',
    placeholder: 'Try "tomorrow" or "in ten days"',
    showQuickButtons: false,
    showClearButton: true,
    showTodayButton: true,
    formatInputOnAccept: true,
    showKeyboardHint: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
   await labelAndInputAreCorrectlyAssociated(canvasElement);
   await inputFormattingWorksForSingleDates(canvasElement);
  }
};

export const SingleParsing: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-single-date-parsing',
    referenceDate: "2023-01-21",
    maxDate: "2034-11-02",
    minDate: "1988-12-30",
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
   await datepickerTextInputParsesSingleDates(canvasElement);
  }
};

export const RangeMode: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-range',
    range: true,
    label: 'Choose a date range',
    placeholder: 'Try "June 8 to 12" or "next week"',
    showQuickButtons: true,
    showClearButton: true,
    showTodayButton: true,
    formatInputOnAccept: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
    minDate: "1970-01-01",
    maxDate: "2030-01-01",
    referenceDate: "2023-01-21",
    quickButtons: ["July 5-10", "August 1999 - September 2000"]
  },
  play: async ({ canvasElement }) => {
   await datepickerTextInputParsesDateRanges(canvasElement);
   await quickButtonsMultiChangeDates(canvasElement);
   await inputFormattingWorksForDateRanges(canvasElement);
  }
};

export const WithQuickButtons: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-no-quick',
    placeholder: 'Try the quick buttons!',
    showQuickButtons: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
    referenceDate: "2023-01-21",
    quickButtons: ["Yesterday", "In ten days"]
  },
  play: async ({ canvasElement }) => {
    await quickButtonsSingleChangeDates(canvasElement);
  }
};

export const WithValue: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-with-value',
    value: '2026-03-15',
    placeholder: 'Select a date',
  },
};

export const Disabled: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-disabled',
    disabled: true,
    placeholder: 'This is disabled',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithConstraints: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-constraints',
    placeholder: 'Only dates in March 2026',
    minDate: '2026-03-01',
    maxDate: '2026-03-31',
    startDate: '2026-03-15',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const InlineCalendar: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-inline',
    inline: true,
    placeholder: 'Try any date input',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithYearStepper: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-year-stepper',
    placeholder: 'Navigate by years',
    showYearStepper: true,
    showMonthStepper: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const SundayFirstDay: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-sunday',
    placeholder: 'Sunday as first day',
    firstDayOfWeek: 0,
    locale: 'en-US',
  },
};

export const JapaneseLocale: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-ja',
    locale: 'ja-JP',
    label: '日付を選択',
    placeholder: '「明日」または「10日後」を試してください',
    firstDayOfWeek: 0, // Japan typically starts week on Sunday
  },
};

export const UnsupportedLocale: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-sv',
    locale: 'sv-SE',
    label: 'Välj ett datum',
  },
  play: async ({ canvasElement, args }) => {
    await doesNotParseUnsupportedLocales(canvasElement);
    await textFieldAcceptsIsoFormattedDatesForNonChronoLocales(canvasElement);

  }
};

export const UnsupportedLocaleRange: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-sv',
    locale: 'sv-SE',
    label: 'Välj ett datum',
    range: true,
  },
  play: async ({ canvasElement, args }) => {
    await textFieldAcceptsIsoFormattedDateRangesForNonChronoLocales(canvasElement);
  }
};

export const MinimalUI: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-minimal',
    label: 'Minimal date picker',
    placeholder: 'Select date',
    showClearButton: false,
    showTodayButton: false,
    showKeyboardHint: false,
    formatInputOnAccept: false,
    firstDayOfWeek: 1,
    locale: 'en-US',
    quickButtons: []
  },
};


export const SingleWithoutInputShouldFormat: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-minimal',
    placeholder: 'Select date',
    locale: 'en-US',
    formatInputOnAccept: false,
  },
  play: async ({ canvasElement }) => {
    await inputInOneFormat(canvasElement);
  }
};

export const RangeWithoutInputShouldFormat: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-minimal',
    placeholder: 'Select date',
    locale: 'en-US',
    formatInputOnAccept: false,
    range: true,
  },
  play: async ({ canvasElement }) => {
    await inputRangeInOneFormat(canvasElement);
  }
};

// Format-related stories
export const DefaultFormat: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-default-format',
    label: 'Default format (YYYY-MM-DD)',
    placeholder: 'Select date',
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await verifyDefaultFormat(canvasElement);
  }
};

export const DDMMYYYYFormat: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-ddmmyyyy',
    label: 'DD/MM/YYYY format',
    format: 'DD/MM/YYYY',
    value: '15/03/2026',
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await verifyDDMMYYYYFormat(canvasElement);
  }
};

export const MMDDYYYYFormat: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-mmddyyyy',
    label: 'MM/DD/YYYY format',
    format: 'MM/DD/YYYY',
    value: '03/15/2026',
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await verifyMMDDYYYYFormat(canvasElement);
  }
};

export const CustomFormatWithValue: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-custom-format-value',
    label: 'Custom format with value',
    format: 'DD/MM/YYYY',
    value: '15/03/2026',
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await verifyValueInCustomFormat(canvasElement);
  }
};

export const CustomMomentFormatTokens: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-moment-tokens',
    label: 'Custom Moment format tokens',
    format: 'YYYY-MM-DD',
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await verifyCustomMomentFormat(canvasElement);
  }
};

export const FormatConsistencyOnUpdate: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-format-consistency',
    label: 'Format consistency on updates',
    format: 'DD-MM-YYYY',
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await verifyFormatConsistency(canvasElement);
  }
};

export const RangeModeWithCustomFormat: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-range-custom-format',
    label: 'Range with custom format',
    format: 'DD/MM/YYYY',
    range: true,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await verifyRangeWithCustomFormat(canvasElement);
  }
};

export const FormattedValueInEvent: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-formatted-event',
    label: 'Formatted value in events',
    format: 'DD/MM/YYYY',
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await verifyFormattedValueInEvent(canvasElement);
  }
};

export const NaturalLanguageWithCustomFormat: Story = {
  args: {
    ...commonArgs,
    id: 'datepicker-natural-language-format',
    label: 'Natural language with custom format',
    format: 'DD/MM/YYYY',
    locale: 'en-US',
    referenceDate: '2026-03-15',
  },
  play: async ({ canvasElement }) => {
    await verifyNaturalLanguageWithFormat(canvasElement);
  }
};




async function labelAndInputAreCorrectlyAssociated   (canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;
  const label = await canvas.findByText('Choose a date') as HTMLLabelElement;

  expect(input.getAttribute("id")).not.toContain("undefined");
  expect(label.getAttribute("for")).not.toContain("undefined");
  expect(input.getAttribute("id")).toEqual(label.getAttribute("for"));
}

async function datepickerTextInputParsesSingleDates (canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;

  await fireEvent.change(input, { target: {value: 'Yesterday'}})
  await waitFor(() => expect(input.value).toContain("January 20, 2023"));

  await fireEvent.change(input, { target: {value: 'In ten days'}})
  await waitFor(() => expect(input.value).toContain("January 31, 2023"));

  await fireEvent.change(input, { target: {value: 'August 8 2004'}})
  await waitFor(() => expect(input.value).toContain("August 8, 2004"));

  await fireEvent.change(input, { target: {value: '50 years ago'}})
  await waitFor(() => expect(input.value).toContain("50 years ago"));
  await canvas.findByText('Please fill in a date after 1988-12-29')
  await expect(input).toHaveAttribute("aria-invalid");

  await fireEvent.change(input, { target: {value: 'In 50 years'}})
  await waitFor(() => expect(input.value).toContain("In 50 years"));
  await canvas.findByText('Please fill in a date before 2034-11-03')
  await expect(input).toHaveAttribute("aria-invalid");
}


async function datepickerTextInputParsesDateRanges (canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;

  await fireEvent.change(input, { target: {value: 'From today to tomorrow'}})
  await waitFor(() => expect(input.value).toContain("Jan 21, 2023 to Jan 22, 2023"));

  await fireEvent.change(input, { target: {value: 'June to august 1984'}})
  await waitFor(() => expect(input.value).toContain("Jun 1, 1984 to Aug 1, 1984"));

  await fireEvent.change(input, { target: {value: '2023-09-10 - 2023-09-30'}})
  await waitFor(() => expect(input.value).toContain("Sep 10, 2023 to Sep 30, 2023"));

  await fireEvent.change(input, { target: {value: '9/10/23 to 9/30/23'}})
  await waitFor(() => expect(input.value).toContain("Sep 10, 2023 to Sep 30, 2023"));

  await fireEvent.change(input, { target: {value: 'Today to 20 days'}})
  await waitFor(() => expect(input.value).toContain("Jan 21, 2023 to Feb 10, 2023"));

  await fireEvent.change(input, { target: {value: 'Friday'}})
  await waitFor(() => expect(input.value).toContain("Jan 27, 2023"));

  await fireEvent.change(input, { target: {value: 'June to july 1964'}})
  await canvas.findByText('Please enter a valid range of dates')
  await expect(input).toHaveAttribute("aria-invalid");

  await fireEvent.change(input, { target: {value: 'June to july 2055'}})
  await canvas.findByText('Please enter a valid range of dates')
  await expect(input).toHaveAttribute("aria-invalid");
}

async function quickButtonsSingleChangeDates (canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;
  const yesterdayButton = await canvas.findByRole('button', { name: 'Yesterday' })
  await fireEvent.click(yesterdayButton);
  await waitFor(() => expect(input.value).toContain("January 20, 2023"));

  const inTenDaysButton = await canvas.findByRole('button', { name: 'In ten days' })
  await fireEvent.click(inTenDaysButton);
  await waitFor(() => expect(input.value).toContain("January 31, 2023"));
}

async function quickButtonsMultiChangeDates (canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;

  const julyButton = await canvas.findByRole('button', { name: 'July 5-10' })
  await fireEvent.click(julyButton);
  await waitFor(() => expect(input.value).toContain("Jul 5, 2023 to Jul 10, 2023"));

  const augustButton = await canvas.findByRole('button', { name: 'August 1999 - September 2000' })
  await fireEvent.click(augustButton);
  await waitFor(() => expect(input.value).toContain("Aug 1, 1999 to Sep 1, 2000"));
}

async function doesNotParseUnsupportedLocales (canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;

    await fireEvent.change(input, { target: {value: 'om tio dagar'}})
    await waitFor(() => expect(input.value).toContain("om tio dagar"));
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          `inclusive-dates: The chosen locale "sv-SE" is not supported by Chrono.js. Date parsing has been disabled`
        )
      );
}

async function textFieldAcceptsIsoFormattedDatesForNonChronoLocales (canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;

  await fireEvent.change(input, { target: {value: '2023-02-02'}})
  await waitFor(() => expect(input.value).toContain("2 februari 2023"));
}

async function textFieldAcceptsIsoFormattedDateRangesForNonChronoLocales (canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;

  await fireEvent.change(input, { target: { value: '2023-02-02 till 2023-02-04' }})
  await waitFor(() => expect(input.value).toContain("2 feb. 2023 to 4 feb. 2023"));
}
async function inputFormattingWorksForSingleDates(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;

  await fireEvent.change(input, { target: {value: 'June 8 2023'}})
  await waitFor(() => expect(input.value).toContain("Thursday, June 8, 2023"));
  input.focus();
  await waitFor(() => expect(input.value).toContain("2023-06-08"));
  input.blur();
  await waitFor(() => expect(input.value).toContain("Thursday, June 8, 2023"));

  await fireEvent.change(input, { target: {value: 'sdfsdfdsf'}})
  await waitFor(() => expect(input.value).toContain("sdfsdfdsf"));
  await waitFor(() => expect(input.getAttribute("aria-invalid")).toEqual(""));
};

async function inputInOneFormat(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;
  await fireEvent.change(input, { target: {value: 'June 8 2023'}})
  await waitFor(() => expect(input.value).toContain("2023-06-08"));
}

async function inputRangeInOneFormat(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;
  await fireEvent.change(input, { target: {value: 'June 8 - 12 2023'}})
  await waitFor(() => expect(input.value).toContain("2023-06-08 to 2023-06-12"));
}


async function inputFormattingWorksForDateRanges(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox') as HTMLInputElement;

  await fireEvent.change(input, { target: {value: 'June 8 - 12 2023'}})
  await waitFor(() => expect(input.value).toContain("Jun 8, 2023 to Jun 12, 2023"));
  input.focus();
  await waitFor(() => expect(input.value).toContain("2023-06-08 to 2023-06-12"));
  input.blur();
  await waitFor(() => expect(input.value).toContain("Jun 8, 2023 to Jun 12, 2023"));

  await fireEvent.change(input, { target: {value: 'sdfsdfdsf'}})
  await waitFor(() => expect(input.value).toContain("sdfsdfdsf"));
  await waitFor(() => expect(input.getAttribute("aria-invalid")).toEqual(""));
}

// Format-related play functions
async function verifyDefaultFormat(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  // Verify default format is YYYY-MM-DD
  expect(datePicker.format).toBe('YYYY-MM-DD');
}

async function verifyDDMMYYYYFormat(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  expect(datePicker.format).toBe('DD/MM/YYYY');
  expect(datePicker.value).toBe('15/03/2026');
}

async function verifyMMDDYYYYFormat(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  expect(datePicker.format).toBe('MM/DD/YYYY');
  expect(datePicker.value).toBe('03/15/2026');
}

async function verifyValueInCustomFormat(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  // Check if value is set correctly
  expect(datePicker.value).toBe('15/03/2026');

  // Verify it's a valid date in the given format
  const moment = await import('moment');
  const parsedDate = moment.default('15/03/2026', 'DD/MM/YYYY', true);
  expect(parsedDate.isValid()).toBe(true);
}

async function verifyCustomMomentFormat(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  // Set a value programmatically
  datePicker.value = '2026-03-15';

  // Verify the value is in the correct format
  expect(datePicker.value).toBe('2026-03-15');

  const moment = await import('moment');
  const parsedDate = moment.default('2026-03-15', 'YYYY-MM-DD', true);
  expect(parsedDate.isValid()).toBe(true);
}

async function verifyFormatConsistency(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  // Set value programmatically
  datePicker.value = '15-03-2026';

  // Value should remain in the same format
  expect(datePicker.value).toBe('15-03-2026');
  expect(datePicker.format).toBe('DD-MM-YYYY');
}

async function verifyRangeWithCustomFormat(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  expect(datePicker.range).toBe(true);
  expect(datePicker.format).toBe('DD/MM/YYYY');
}

async function verifyFormattedValueInEvent(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  expect(datePicker.format).toBe('DD/MM/YYYY');

  // Programmatically set value to verify it works with the format
  datePicker.value = '15/03/2026';
  expect(datePicker.value).toBe('15/03/2026');
}

async function verifyNaturalLanguageWithFormat(canvasElement: HTMLElement) {
  const datePicker = canvasElement.querySelector('inclusive-dates') as HTMLInclusiveDatesElement;
  await customElements.whenDefined('inclusive-dates');

  await new Promise<void>((resolve) => {
    datePicker.addEventListener('componentReady', () => resolve(), { once: true });
  });

  // Test the parseDate method with custom format
  const result = await datePicker.parseDate('tomorrow', false);

  // It should return a date in DD/MM/YYYY format
  if (result.value) {
    const moment = await import('moment');
    const parsedDate = moment.default(result.value, 'DD/MM/YYYY', true);
    expect(parsedDate.isValid()).toBe(true);
  }
}

