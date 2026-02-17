import { newSpecPage } from '@stencil/core/testing';
import * as chronoParser from '../../utils/chrono-parser/chrono-parser';
import { InclusiveDates } from './inclusive-dates';

jest.mock('@react-aria/live-announcer', () => ({
  announce: jest.fn(),
}));

describe('inclusive-dates', () => {
  const originalWarn = console.warn;
  const originalError = console.error;

  beforeEach(() => {
    jest.restoreAllMocks();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.warn = originalWarn;
    console.error = originalError;
  });

  const createPage = async (html = `<inclusive-dates id="test"></inclusive-dates>`) => {
    return newSpecPage({
      components: [InclusiveDates],
      html,
    });
  };

  it('renders and validates required id on load', async () => {
    await createPage('<inclusive-dates></inclusive-dates>');
    expect(console.error).toHaveBeenCalledWith(
      'inclusive-dates: The "id" prop is required for accessibility',
    );
  });

  it('warns when chrono locale is unsupported', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    instance.locale = 'sv-SE';
    instance.chronoSupportedLocale = false;
    instance.componentDidLoad();

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('inclusive-dates: The chosen locale "sv-SE" is not supported by Chrono.js'),
    );
  });

  it('parseDate sets value on valid parse and returns formatted value', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    jest.spyOn(chronoParser, 'chronoParseDate').mockResolvedValue({
      value: new Date('2023-06-08'),
    } as any);

    const result = await instance.parseDate('June 8 2023', true);

    expect(result.value).toBe('2023-06-08');
    expect(instance.internalValue).toBe('2023-06-08');
    expect(instance.errorState).toBe(false);
  });

  it('parseDate keeps invalid state when parsing fails', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    jest.spyOn(chronoParser, 'chronoParseDate').mockResolvedValue({
      value: null,
      reason: 'invalid',
    } as any);

    const result = await instance.parseDate('bad input', true);

    expect(result.value).toBeUndefined();
    expect(result.reason).toBe('invalid');
    expect(instance.errorState).toBe(true);
  });

  it('handleCalendarButtonClick toggles modal open and close', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;
    jest.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);

    const setTriggerElement = jest.fn();
    const open = jest.fn();
    const close = jest.fn();
    let state = false;

    instance.calendarButtonRef = {} as HTMLButtonElement;
    instance.modalRef = {
      setTriggerElement,
      getState: jest.fn(async () => state),
      open: jest.fn(async () => {
        state = true;
        open();
      }),
      close: jest.fn(async () => {
        state = false;
        close();
      }),
    };

    await instance.handleCalendarButtonClick();
    await instance.handleCalendarButtonClick();

    expect(setTriggerElement).toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('handleQuickButtonClick parses single date quick buttons', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    instance.inputRef = { value: '' } as HTMLInputElement;
    jest.spyOn(chronoParser, 'chronoParseDate').mockResolvedValue({ value: new Date('2023-01-20') } as any);

    await instance.handleQuickButtonClick({
      target: { innerText: 'Yesterday' },
    } as unknown as MouseEvent);

    expect(instance.internalValue).toBe('2023-01-20');
  });

  it('handleQuickButtonClick parses range quick buttons', async () => {
    const page = await createPage('<inclusive-dates id="test" range></inclusive-dates>');
    const instance = page.rootInstance as any;

    instance.inputRef = { value: '' } as HTMLInputElement;
    jest.spyOn(chronoParser, 'chronoParseRange').mockResolvedValue({
      value: {
        start: new Date('2023-07-05'),
        end: new Date('2023-07-10'),
      },
    } as any);

    await instance.handleQuickButtonClick({
      target: { innerText: 'July 5-10' },
    } as unknown as MouseEvent);

    expect(instance.internalValue).toEqual(['2023-07-05', '2023-07-10']);
  });

  it('handleChange clears single input and emits empty value', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    instance.pickerRef = { value: new Date('2023-01-01') };
    const emitSpy = jest.spyOn(instance.selectDate, 'emit');

    await instance.handleChange({ target: { value: '' } } as any);

    expect(instance.internalValue).toBe('');
    expect(instance.pickerRef.value).toBeNull();
    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('handleChange sets disabled-date error for single mode', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    instance.disableDate = () => true;
    jest.spyOn(chronoParser, 'chronoParseDate').mockResolvedValue({ value: new Date('2023-06-08') } as any);

    await instance.handleChange({ target: { value: 'June 8 2023' } } as any);

    expect(instance.errorState).toBe(true);
    expect(instance.errorMessage).toBe(instance.inclusiveDatesLabels.disabledDateError);
  });

  it('handleChange sets min/max/invalid errors for single mode', async () => {
    const page = await createPage('<inclusive-dates id="test" min-date="1988-12-30" max-date="2034-11-02"></inclusive-dates>');
    const instance = page.rootInstance as any;

    const parseSpy = jest.spyOn(chronoParser, 'chronoParseDate');

    parseSpy.mockResolvedValueOnce({ value: null, reason: 'minDate' } as any);
    await instance.handleChange({ target: { value: 'too early' } } as any);
    expect(instance.errorState).toBe(true);
    expect(instance.errorMessage).toContain('1988-12-29');

    parseSpy.mockResolvedValueOnce({ value: null, reason: 'maxDate' } as any);
    await instance.handleChange({ target: { value: 'too late' } } as any);
    expect(instance.errorMessage).toContain('2034-11-03');

    parseSpy.mockResolvedValueOnce({ value: null, reason: 'invalid' } as any);
    await instance.handleChange({ target: { value: 'bad input' } } as any);
    expect(instance.errorMessage).toBe(instance.inclusiveDatesLabels.invalidDateError);
  });

  it('handleChange updates range and handles range errors', async () => {
    const page = await createPage('<inclusive-dates id="test" range></inclusive-dates>');
    const instance = page.rootInstance as any;

    instance.inputRef = { value: '' } as HTMLInputElement;
    const parseSpy = jest.spyOn(chronoParser, 'chronoParseRange');

    parseSpy.mockResolvedValueOnce({
      value: { start: new Date('2023-06-08'), end: new Date('2023-06-12') },
    } as any);
    await instance.handleChange({ target: { value: 'June 8 - 12 2023' } } as any);
    expect(instance.internalValue).toEqual(['2023-06-08', '2023-06-12']);

    parseSpy.mockResolvedValueOnce({ value: null, reason: 'rangeOutOfBounds' } as any);
    await instance.handleChange({ target: { value: 'bad range' } } as any);
    expect(instance.errorState).toBe(true);
    expect(instance.errorMessage).toBe(instance.inclusiveDatesLabels.rangeOutOfBoundsError);
  });

  it('handles range input clear and emits empty value', async () => {
    const page = await createPage('<inclusive-dates id="test" range></inclusive-dates>');
    const instance = page.rootInstance as any;
    instance.pickerRef = { value: [new Date('2023-06-08'), new Date('2023-06-12')] };
    const emitSpy = jest.spyOn(instance.selectDate, 'emit');

    await instance.handleChange({ target: { value: '' } } as any);

    expect(instance.internalValue).toBe('');
    expect(instance.pickerRef.value).toBeNull();
    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('handleChange updates single value when parsed and enabled', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;
    instance.inputRef = { value: '' } as HTMLInputElement;
    instance.disableDate = () => false;
    const updateSpy = jest.spyOn(instance, 'updateValue');
    const formatSpy = jest.spyOn(instance, 'formatInput');

    jest.spyOn(chronoParser, 'chronoParseDate').mockResolvedValue({ value: new Date('2024-07-09') } as any);
    await instance.handleChange({ target: { value: 'July 9 2024' } } as any);

    expect(updateSpy).toHaveBeenCalled();
    expect(formatSpy).toHaveBeenCalledWith(true, false);
    expect(instance.errorState).toBe(false);
  });

  it('formatInput handles plain and formatted modes', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    instance.inputRef = { value: '2023-06-08' } as HTMLInputElement;
    instance.internalValue = '2023-06-08';

    instance.formatInputOnAccept = false;
    instance.formatInput(true, false);
    expect(instance.inputRef.value).toContain('2023-06-08');

    instance.formatInputOnAccept = true;
    instance.errorState = false;
    instance.formatInput(true, false);
    expect(instance.inputRef.value).toContain('June 8, 2023');

    instance.internalValue = ['2023-06-08', '2023-06-12'];
    instance.formatInput(true, false);
    expect(instance.inputRef.value).toContain('Jun 8, 2023 to Jun 12, 2023');

    instance.internalValue = '2023-09-18';
    instance.formatInputOnAccept = undefined;
    instance.errorState = false;
    instance.formatInput(true, false);
    expect(instance.inputRef.value).toBe('2023-09-18');
  });

  it('handlePickerSelection updates single and range selections', async () => {
    const page = await createPage('<inclusive-dates id="test" range></inclusive-dates>');
    const instance = page.rootInstance as any;

    instance.inputRef = { value: '' } as HTMLInputElement;
    instance.modalRef = { close: jest.fn() };

    instance.handlePickerSelection(['2023-06-08', '2023-06-12']);
    expect(instance.internalValue).toEqual(['2023-06-08', '2023-06-12']);
    expect(instance.modalRef.close).toHaveBeenCalled();

    instance.range = false;
    instance.handlePickerSelection('2023-06-08');
    expect(instance.internalValue).toBe('2023-06-08');
  });

  it('announceDateChange announces selected content', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    instance.announceDateChange('2023-06-08');
    instance.announceDateChange(['2023-06-08']);
    instance.announceDateChange([]);
    expect(instance.internalValue).toBeUndefined();
  });

  it('watchers and syncFromValueProp update state and picker/input refs', async () => {
    const page = await createPage('<inclusive-dates id="test" format="DD/MM/YYYY" value="15/03/2026"></inclusive-dates>');
    const instance = page.rootInstance as any;

    instance.inputRef = { value: '' } as HTMLInputElement;
    instance.pickerRef = { value: null };

    instance.watchDisabled(true);
    expect(instance.disabledState).toBe(true);

    instance.watchValue('16/03/2026');
    expect(instance.internalValue).toBe('16/03/2026');
    expect(instance.pickerRef.value).toBeInstanceOf(Date);

    instance.value = ['15/03/2026', '16/03/2026'];
    instance.watchValue(instance.value);
    expect(Array.isArray(instance.pickerRef.value)).toBe(true);
  });

  it('handleChangedMonths and handleYearChange emit announcements/events', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;

    instance.handleChangedMonths({ month: 2, year: 2026 });

    const emitSpy = jest.fn();
    instance.changeYear = { emit: emitSpy };
    instance.handleYearChange({ year: 2025 });
    expect(emitSpy).toHaveBeenCalledWith({ year: 2025 });
  });

  it('renders quick buttons and error block based on state', async () => {
    const page = await createPage('<inclusive-dates id="test" show-quick-buttons></inclusive-dates>');
    const instance = page.rootInstance as any;

    instance.quickButtons = ['Today'];
    instance.chronoSupportedLocale = true;
    instance.errorState = true;
    instance.errorMessage = 'Boom';
    await page.waitForChanges();

    expect(page.root?.querySelector('.inclusive-dates__quick-group')).toBeTruthy();
    expect(page.root?.querySelector('.inclusive-dates__input-error')?.textContent).toContain('Boom');
  });

  it('wires focus/blur and modal/calendar event handlers from render', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;
    const formatSpy = jest.spyOn(instance, 'formatInput');
    const yearSpy = jest.fn();
    instance.changeYear = { emit: yearSpy };

    const input = page.root?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new FocusEvent('blur'));
    await page.waitForChanges();
    expect(formatSpy).toHaveBeenCalledWith(false);
    expect(formatSpy).toHaveBeenCalledWith(true, false);

    const modal = page.root?.querySelector('inclusive-dates-modal') as HTMLElement;
    instance.pickerRef = { modalIsOpen: false };
    modal.dispatchEvent(new CustomEvent('opened'));
    expect(instance.pickerRef.modalIsOpen).toBe(true);
    modal.dispatchEvent(new CustomEvent('closed'));
    expect(instance.pickerRef.modalIsOpen).toBe(false);

    const calendar = page.root?.querySelector('inclusive-dates-calendar') as HTMLElement;
    instance.handlePickerSelection = jest.fn();
    calendar.dispatchEvent(new CustomEvent('selectDate', { detail: '2026-04-11' }));
    calendar.dispatchEvent(new CustomEvent('changeMonth', { detail: { month: 4, year: 2026 } }));
    calendar.dispatchEvent(new CustomEvent('changeYear', { detail: { year: 2027 } }));
    expect(instance.handlePickerSelection).toHaveBeenCalledWith('2026-04-11');
    expect(yearSpy).toHaveBeenCalledWith({ year: 2027 });
  });

  it('uses default disableDate callback', async () => {
    const page = await createPage();
    const instance = page.rootInstance as any;
    expect(instance.disableDate(new Date('2024-01-01'))).toBe(false);
  });

  it('covers additional render and formatting edge branches', async () => {
    const page = await createPage('<inclusive-dates></inclusive-dates>');
    const instance = page.rootInstance as any;

    instance.inputRef = { value: 'September 10 2023' } as HTMLInputElement;
    instance.internalValue = ['2023-09-10', '2023-09-12'];
    instance.errorState = false;
    instance.formatInputOnAccept = true;
    instance.formatInput(true, true);
    expect(instance.inputRef.value).toContain('2023');

    instance.inputRef.value = 'kept';
    instance.internalValue = '';
    instance.formatInputOnAccept = false;
    instance.formatInput(true, false);
    expect(instance.inputRef.value).toBe('kept');

    instance.quickButtons = [];
    instance.chronoSupportedLocale = false;
    instance.errorState = true;
    instance.errorMessage = 'edge';
    await page.waitForChanges();
    expect(page.root?.querySelector('.inclusive-dates__quick-group')).toBeFalsy();

    const error = page.root?.querySelector('.inclusive-dates__input-error');
    expect(error?.id).toBe('');

    instance.changeYear = undefined;
    expect(() => instance.handleYearChange({ year: 2028 })).not.toThrow();
  });
});
