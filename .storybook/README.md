# Storybook Setup

This directory contains the Storybook configuration for the Inclusive Dates component library.

## Running Storybook

To start Storybook in development mode:

```bash
yarn storybook
```

This will:
1. Build the Stencil components
2. Start the Storybook dev server on http://localhost:6006

## Building Storybook

To build a static version of Storybook:

```bash
yarn build-storybook
```

The static build will be output to `storybook-static/` directory.

## Configuration Files

- **main.ts**: Main Storybook configuration
- **preview.ts**: Global configuration for story rendering
- **preview-head.html**: Custom HTML head content for preview iframe

## Story Files

Stories are located alongside components in `src/components/*/` with `.stories.ts` extension:

- `tabworthy-dates.stories.ts`: Main datepicker component stories
- `tabworthy-dates-calendar.stories.ts`: Calendar component stories
- `Introduction.stories.ts`: Getting started documentation

## Adding New Stories

1. Create a new `.stories.ts` file next to your component
2. Import necessary types from `@storybook/web-components`
3. Use `lit-html` for rendering Stencil web components
4. Export stories with proper args and controls

Example:

```typescript
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';

const meta: Meta = {
  title: 'Components/MyComponent',
  render: (args) => html`<my-component .prop=${args.prop}></my-component>`,
};

export default meta;
export const Default: StoryObj = {
  args: {
    prop: 'value',
  },
};
```

## Addons Included

- **@storybook/addon-essentials**: Controls, actions, viewport, backgrounds, etc.
- **@storybook/addon-links**: Link between stories
- **@storybook/addon-a11y**: Accessibility testing panel

## Notes

- Components must be built with `yarn build:stencil` before Storybook can load them
- The `yarn storybook` script automatically builds components first
- Storybook uses Vite for fast development mode
