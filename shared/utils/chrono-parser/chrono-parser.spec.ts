import { isSameDay } from "../utils";
import { chronoParseDate, chronoParseRange } from "./chrono-parser";

describe("chrono parser", () => {
  const referenceDate = new Date("2023-01-11T00:00:00Z");

  describe("chronoParseDate", () => {
    it("parses absolute english dates", async () => {
      let parsed = await chronoParseDate("January 15", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("2023-01-15"))).toBeTruthy();

      parsed = await chronoParseDate("01-10-24", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("2024-01-10"))).toBeTruthy();

      parsed = await chronoParseDate("2024-01-10", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("2024-01-10"))).toBeTruthy();

      parsed = await chronoParseDate("June 1984", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("1984-06-01"))).toBeTruthy();
    });

    it("parses relative dates using reference date", async () => {
      let parsed = await chronoParseDate("today", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("2023-01-11"))).toBeTruthy();

      parsed = await chronoParseDate("tomorrow", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("2023-01-12"))).toBeTruthy();

      parsed = await chronoParseDate("yesterday", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("2023-01-10"))).toBeTruthy();

      parsed = await chronoParseDate("in ten days", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("2023-01-21"))).toBeTruthy();

      parsed = await chronoParseDate("in eleven months", { referenceDate });
      expect(isSameDay(parsed?.value, new Date("2023-12-11"))).toBeTruthy();
    });

    it("supports strict mode behavior", async () => {
      let parsed = await chronoParseDate("today", {
        referenceDate,
        useStrict: true
      });
      expect(parsed).toEqual({ value: null, reason: "invalid" });

      parsed = await chronoParseDate("2023-02-01", {
        referenceDate,
        useStrict: true
      });
      expect(isSameDay(parsed?.value, new Date("2023-02-01"))).toBeTruthy();

      parsed = await chronoParseDate("August 8 2004", {
        referenceDate,
        useStrict: true
      });
      expect(isSameDay(parsed?.value, new Date("2004-08-08"))).toBeTruthy();
    });

    it("respects min and max date bounds", async () => {
      let parsed = await chronoParseDate("july 1999", {
        referenceDate,
        minDate: "2000-01-01",
        maxDate: "2030-12-31"
      });
      expect(parsed).toEqual({ value: null, reason: "minDate" });

      parsed = await chronoParseDate("in 50 years", {
        referenceDate,
        minDate: "2000-01-01",
        maxDate: "2030-12-31"
      });
      expect(parsed).toEqual({ value: null, reason: "maxDate" });

      parsed = await chronoParseDate("December 31 2030", {
        referenceDate,
        minDate: "2000-01-01",
        maxDate: "2030-12-31"
      });
      expect(isSameDay(parsed?.value, new Date("2030-12-31"))).toBeTruthy();
    });

    it("handles unsupported locales and defaults path", async () => {
      let parsed = await chronoParseDate("2024-05-15", {
        referenceDate,
        locale: "sv"
      });
      expect(isSameDay(parsed?.value, new Date("2024-05-15"))).toBeTruthy();

      parsed = await chronoParseDate("om tio dagar", {
        referenceDate,
        locale: "sv"
      });
      expect(parsed).toBeNull();

      parsed = await chronoParseDate("2024-01-10");
      expect(parsed?.value instanceof Date).toBeTruthy();
    });

    it("supports custom expressions", async () => {
      const customExpression = {
        pattern: /blueday/i,
        match: {
          day: 18,
          month: 9,
          year: 2026
        }
      };

      const parsed = await chronoParseDate("blueday", {
        locale: "en",
        customExpressions: [customExpression]
      });
      expect(isSameDay(parsed?.value, new Date("2026-09-18"))).toBeTruthy();
    });

    it("returns invalid for unparseable values", async () => {
      const parsed = await chronoParseDate("xyzabc123", { referenceDate });
      expect(parsed).toEqual({ value: null, reason: "invalid" });
    });
  });

  describe("chronoParseRange", () => {
    it("parses natural-language ranges and single start dates", async () => {
      let parsed = await chronoParseRange("from january 25 to january 30", {
        referenceDate
      });
      expect(
        isSameDay(parsed?.value?.start, new Date("2023-01-25"))
      ).toBeTruthy();
      expect(
        isSameDay(parsed?.value?.end, new Date("2023-01-30"))
      ).toBeTruthy();

      parsed = await chronoParseRange("june 1984 - february 1990", {
        referenceDate
      });
      expect(
        isSameDay(parsed?.value?.start, new Date("1984-06-01"))
      ).toBeTruthy();
      expect(
        isSameDay(parsed?.value?.end, new Date("1990-02-01"))
      ).toBeTruthy();

      parsed = await chronoParseRange("june second 2008", { referenceDate });
      expect(
        isSameDay(parsed?.value?.start, new Date("2008-06-02"))
      ).toBeTruthy();
      expect(parsed?.value?.end).toBeNull();
    });

    it("handles strict mode for ranges", async () => {
      let parsed = await chronoParseRange("today to tomorrow", {
        referenceDate,
        useStrict: true
      });
      expect(parsed).toEqual({ value: null, reason: "invalid" });

      parsed = await chronoParseRange("January 15 2023 - January 20 2023", {
        referenceDate,
        useStrict: true
      });
      expect(parsed?.value?.start).toBeTruthy();
      expect(parsed?.value?.end).toBeTruthy();
    });

    it("respects min and max date bounds for ranges", async () => {
      let parsed = await chronoParseRange("June 1999 - August 2000", {
        referenceDate,
        minDate: "2000-01-01",
        maxDate: "2030-12-31"
      });
      expect(parsed?.value?.start).toBeNull();
      expect(parsed?.value?.end).toBeTruthy();

      parsed = await chronoParseRange("June 2035 - August 2040", {
        referenceDate,
        minDate: "2000-01-01",
        maxDate: "2030-12-31"
      });
      expect(parsed).toEqual({ value: null, reason: "rangeOutOfBounds" });
    });

    it("handles unsupported locales for ISO ranges", async () => {
      let parsed = await chronoParseRange("2024-05-15 till 2024-05-20", {
        referenceDate,
        locale: "sv"
      });
      expect(
        isSameDay(parsed?.value?.start, new Date("2024-05-15"))
      ).toBeTruthy();
      expect(
        isSameDay(parsed?.value?.end, new Date("2024-05-20"))
      ).toBeTruthy();

      parsed = await chronoParseRange("fran 2024-07-01", {
        referenceDate,
        locale: "sv"
      });
      expect(
        isSameDay(parsed?.value?.start, new Date("2024-07-01"))
      ).toBeTruthy();
      expect(parsed?.value?.end).toBeUndefined();

      parsed = await chronoParseRange("inte ett datumintervall", {
        referenceDate,
        locale: "sv"
      });
      expect(parsed).toBeNull();

      parsed = await chronoParseRange("2024-05-15 2024-05-20", {
        referenceDate,
        locale: "sv"
      });
      expect(
        isSameDay(parsed?.value?.start, new Date("2024-05-15"))
      ).toBeTruthy();
      expect(
        isSameDay(parsed?.value?.end, new Date("2024-05-20"))
      ).toBeTruthy();
    });

    it("supports custom expressions and defaults path", async () => {
      const customExpression = {
        pattern: /blueday/i,
        match: {
          day: 18,
          month: 9,
          year: 2026
        }
      };

      let parsed = await chronoParseRange("blueday to blueday", {
        locale: "en",
        customExpressions: [customExpression]
      });
      expect(
        isSameDay(parsed?.value?.start, new Date("2026-09-18"))
      ).toBeTruthy();

      parsed = await chronoParseRange("2024-01-10 to 2024-01-12");
      expect(parsed?.value?.start instanceof Date).toBeTruthy();
    });

    it("returns invalid for unparseable range values", async () => {
      const parsed = await chronoParseRange("xyzabc123", { referenceDate });
      expect(parsed).toEqual({ value: null, reason: "invalid" });
    });

    it("returns partially bounded ranges when at least one date is valid", async () => {
      const parsed = await chronoParseRange("June 1999 - August 2005", {
        referenceDate,
        minDate: "2000-01-01",
        maxDate: "2030-12-31"
      });

      expect(parsed?.value?.start).toBeNull();
      expect(
        isSameDay(parsed?.value?.end, new Date("2005-08-01"))
      ).toBeTruthy();
    });
  });
});
