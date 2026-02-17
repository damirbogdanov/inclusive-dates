import type { Preview } from "@storybook/web-components-vite";
import { defineCustomElements } from "../dist/esm/loader";

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
};

export default preview;
