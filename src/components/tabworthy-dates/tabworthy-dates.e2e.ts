import { newE2EPage } from '@stencil/core/testing';

/**
 * E2E tests for InclusiveDates component
 * Converted from Storybook interaction tests for proper coverage tracking
 */
describe('tabworthy-dates e2e', () => {

  describe('accessibility', () => {
    it('should have correctly associated label and input', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates id="test-1" label="Choose a date"></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');
      const label = await page.find('tabworthy-dates >>> label');

      const inputId = await input.getAttribute('id');
      const labelFor = await label.getAttribute('for');

      expect(inputId).toBeTruthy();
      expect(labelFor).toBeTruthy();
      expect(inputId).not.toContain('undefined');
      expect(labelFor).not.toContain('undefined');
      expect(inputId).toEqual(labelFor);
    });
  });

  describe('single date parsing', () => {
    it('should parse natural language dates', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-2"
          label="Choose a date"
          reference-date="2023-01-21"
          max-date="2034-11-02"
          min-date="1988-12-30"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      // Test "Yesterday"
      await input.press('Backspace'); // Clear any existing value
      await input.type('Yesterday');
      await page.keyboard.press('Tab'); // Trigger blur
      await page.waitForChanges();

      let value = await input.getProperty('value');
      expect(value).toContain('January 20, 2023');

      // Test "In ten days"
      await input.click({ clickCount: 3 }); // Select all
      await input.type('In ten days');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('January 31, 2023');

      // Test explicit date
      await input.click({ clickCount: 3 });
      await input.type('August 8 2004');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('August 8, 2004');
    });

    it('should validate min date constraint', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-3"
          label="Choose a date"
          reference-date="2023-01-21"
          max-date="2034-11-02"
          min-date="1988-12-30"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      await input.type('50 years ago');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      const ariaInvalid = await input.getAttribute('aria-invalid');
      const errorMessage = await page.find('tabworthy-dates >>> .error-message');

      expect(ariaInvalid).toBeTruthy();
      expect(errorMessage).toBeTruthy();
    });

    it('should validate max date constraint', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-4"
          label="Choose a date"
          reference-date="2023-01-21"
          max-date="2034-11-02"
          min-date="1988-12-30"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      await input.type('In 50 years');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      const ariaInvalid = await input.getAttribute('aria-invalid');
      const errorMessage = await page.find('tabworthy-dates >>> .error-message');

      expect(ariaInvalid).toBeTruthy();
      expect(errorMessage).toBeTruthy();
    });
  });

  describe('date ranges', () => {
    it('should parse date range inputs', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-5"
          label="Choose a date range"
          range
          reference-date="2023-01-21"
          min-date="1970-01-01"
          max-date="2030-01-01"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      // Test "From today to tomorrow"
      await input.type('From today to tomorrow');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      let value = await input.getProperty('value');
      expect(value).toContain('Jan 21, 2023 to Jan 22, 2023');

      // Test explicit date range
      await input.click({ clickCount: 3 });
      await input.type('June to august 1984');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('Jun 1, 1984 to Aug 1, 1984');

      // Test ISO formatted range
      await input.click({ clickCount: 3 });
      await input.type('2023-09-10 - 2023-09-30');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('Sep 10, 2023 to Sep 30, 2023');
    });

    it('should validate date ranges', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-6"
          label="Choose a date range"
          range
          reference-date="2023-01-21"
          min-date="1970-01-01"
          max-date="2030-01-01"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      // Test invalid range (before min date)
      await input.type('June to july 1964');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      let ariaInvalid = await input.getAttribute('aria-invalid');
      expect(ariaInvalid).toBeTruthy();

      // Test invalid range (after max date)
      await input.click({ clickCount: 3 });
      await input.type('June to july 2055');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      ariaInvalid = await input.getAttribute('aria-invalid');
      expect(ariaInvalid).toBeTruthy();
    });
  });

  describe('quick buttons', () => {
    it('should populate input when quick button clicked (single dates)', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-7"
          label="Choose a date"
          show-quick-buttons
          reference-date="2023-01-21"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const component = await page.find('tabworthy-dates');
      component.setProperty('quickButtons', ['Yesterday', 'In ten days']);
      await page.waitForChanges();

      const input = await page.find('tabworthy-dates >>> input');

      // Click "Yesterday" button
      const yesterdayButton = await page.find('tabworthy-dates >>> button:nth-of-type(1)');
      await yesterdayButton.click();
      await page.waitForChanges();

      let value = await input.getProperty('value');
      expect(value).toContain('January 20, 2023');

      // Click "In ten days" button
      const inTenDaysButton = await page.find('tabworthy-dates >>> button:nth-of-type(2)');
      await inTenDaysButton.click();
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('January 31, 2023');
    });

    it('should populate input when quick button clicked (ranges)', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-8"
          label="Choose a date range"
          range
          show-quick-buttons
          reference-date="2023-01-21"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const component = await page.find('tabworthy-dates');
      component.setProperty('quickButtons', ['July 5-10', 'August 1999 - September 2000']);
      await page.waitForChanges();

      const input = await page.find('tabworthy-dates >>> input');

      // Click first quick button
      const julyButton = await page.find('tabworthy-dates >>> button:nth-of-type(1)');
      await julyButton.click();
      await page.waitForChanges();

      let value = await input.getProperty('value');
      expect(value).toContain('Jul 5, 2023 to Jul 10, 2023');

      // Click second quick button
      const augustButton = await page.find('tabworthy-dates >>> button:nth-of-type(2)');
      await augustButton.click();
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('Aug 1, 1999 to Sep 1, 2000');
    });
  });

  describe('input formatting', () => {
    it('should format single dates on focus/blur', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-9"
          label="Choose a date"
          input-should-format="true"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      // Type a date
      await input.type('June 8 2023');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      // Should show formatted version
      let value = await input.getProperty('value');
      expect(value).toContain('Thursday, June 8, 2023');

      // Focus should show ISO format
      await input.focus();
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('2023-06-08');

      // Blur should show formatted again
      await input.press('Tab');
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('Thursday, June 8, 2023');
    });

    it('should format date ranges on focus/blur', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-10"
          label="Choose a date range"
          range
          input-should-format="true"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      // Type a range
      await input.type('June 8 - 12 2023');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      // Should show formatted version
      let value = await input.getProperty('value');
      expect(value).toContain('Jun 8, 2023 to Jun 12, 2023');

      // Focus should show ISO format
      await input.focus();
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('2023-06-08 to 2023-06-12');

      // Blur should show formatted again
      await input.press('Tab');
      await page.waitForChanges();

      value = await input.getProperty('value');
      expect(value).toContain('Jun 8, 2023 to Jun 12, 2023');
    });
  });

  describe('unsupported locales', () => {
    it('should not parse natural language for unsupported locales', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-11"
          label="Välj ett datum"
          locale="sv-SE"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      // Try natural language input in Swedish
      await input.type('om tio dagar');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      // Should remain unchanged (not parsed)
      const value = await input.getProperty('value');
      expect(value).toContain('om tio dagar');
    });

    it('should accept ISO dates for unsupported locales', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-12"
          label="Välj ett datum"
          locale="sv-SE"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      // Type ISO date
      await input.type('2023-02-02');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      // Should be accepted and formatted
      const value = await input.getProperty('value');
      expect(value).toContain('2023-02-02');
    });
  });

  describe('custom formats', () => {
    it('should respect custom date formats', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-13"
          label="Choose a date"
          format="DD/MM/YYYY"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');

      await input.type('June 8 2023');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      const value = await input.getProperty('value');
      expect(value).toContain('08/06/2023');
    });
  });

  describe('inline mode', () => {
    it('should show calendar inline when inline prop is set', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-14"
          label="Choose a date"
          inline
        ></tabworthy-dates>
      `);

      const calendar = await page.find('tabworthy-dates >>> tabworthy-dates-calendar');
      expect(calendar).toBeTruthy();

      // Calendar should be visible
      const calendarStyle = await calendar.getComputedStyle();
      expect(calendarStyle.display).not.toBe('none');
    });
  });

  describe('disabled state', () => {
    it('should disable input when disabled prop is set', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-15"
          label="Choose a date"
          disabled
        ></tabworthy-dates>
      `);

      const input = await page.find('tabworthy-dates >>> input');
      const isDisabled = await input.getProperty('disabled');

      expect(isDisabled).toBe(true);
    });
  });

  describe('events', () => {
    it('should emit dateChange event when date changes', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <tabworthy-dates
          id="test-16"
          label="Choose a date"
          locale="en-US"
        ></tabworthy-dates>
      `);

      const component = await page.find('tabworthy-dates');
      const dateChangeSpy = await component.spyOnEvent('dateChange');

      const input = await page.find('tabworthy-dates >>> input');
      await input.type('tomorrow');
      await page.keyboard.press('Tab');
      await page.waitForChanges();

      expect(dateChangeSpy).toHaveReceivedEvent();
    });
  });
});
