<div align="center">
  <h1>TabworthyDates and TabworthyTimes components</h1>

  <p>
    <video controls autoplay>
      <source src="https://github.com/fymmot/inclusive-dates/blob/main/docs/images/demo.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </p>

  <p><strong>A human-friendly and fully accessible datepicker and datetimepicker with partial support for natural language input. </strong></p>

  <p>Now as a standard Web Component written in Typescript with 100% test coverage!</p>
  <p>Try typing "tomorrow" or "in 10 days"!</p>
  <p>Datepicker is forked from the excellent <a href="https://github.com/fymmot/inclusive-dates"><code>fymmot/inclusive-dates</code></a></p>

  <div>
    <img alt="Github test action status" src="https://github.com/tabworthy/tabworthy-components/actions/workflows/test.yml/badge.svg" />
    <img alt="Github docs action status" src="https://github.com/tabworthy/tabworthy-components/actions/workflows/docs.yml/badge.svg" />
    <img alt="Codecov coverage" src="https://codecov.io/gh/tabworthy/tabworthy-components/branch/main/graph/badge.svg" />
    <img alt="NPM version" src="https://img.shields.io/npm/v/@tabworthy/components?color=informational">
  </div>
</div>

### Documentation & [Demo](https://tabworthy.github.io/tabworthy-components)

All components are documented in Storybook, which also serves as a demo. You can find it here:
**https://tabworthy.github.io/tabworthy-components/**

If you just interested in API documentation for components without the demo, you can find it here:

* [TabworthyDates](https://github.com/tabworthy/tabworthy-components/tree/main/src/components/tabworthy-dates)
* [TabworthyTimes](https://github.com/tabworthy/tabworthy-components/tree/main/src/components/tabworthy-times)

### Features

#### Natural language input

Datepicker text field accepts natural language input using Chrono.js. Try typing "yesterday", "May tenth" or "in one year"!.

#### Accessibility first

Built to support users of assistive technology. Follows the WAI-ARIA APG Datepicker dialog pattern.

#### Framework-agnostic

Standard Web Component that works with any framework – or no framework at all.

#### Small footprint

The component is ~45KB minified and gzipped with Chrono.js.

#### Low dependency

External dependencies limited to accessibility utils (@react-aria/live-announcer, @a11y/focus-trap and aria-hidden).

#### Strongly typed

Written in TypeScript.

#### Localizable

Customizable labels and date formats.

#### Customizable

Semantic markup with no built-in styles.

#### 100% Test Coverage

Quality assured by means of unit tests.
