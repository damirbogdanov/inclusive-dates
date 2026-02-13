import type { Preview } from "@storybook/web-components-vite";
import { defineCustomElements } from "../dist/esm/loader";
import { spyOn } from "@storybook/test";

import "../src/themes/light.scss";
import "../src/themes/dark.scss";

defineCustomElements();

function applyTheme(ctx: any) {
  const theme = ctx.globals?.backgrounds?.value === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: "light", value: "#ffffff" },
        dark: { name: "dark", value: "#1a1a1a" },
      },
    },
  },
  initialGlobals: { backgrounds: { value: "light" } },

  decorators: [
    (story, ctx) => {
      applyTheme(ctx);
      return story();
    },
  ],

  async beforeEach() {
    spyOn(console, "warn").mockName("console.warn");
  },
  async afterEach() {
    (console.warn as any).mockClear?.();
  },
};

export default preview;
