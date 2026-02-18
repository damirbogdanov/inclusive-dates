import type { Components, JSX } from "../types/components";

interface TabworthyDates extends Components.TabworthyDates, HTMLElement {}
export const TabworthyDates: {
    prototype: TabworthyDates;
    new (): TabworthyDates;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
