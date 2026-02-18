import type { Components, JSX } from "../types/components";

interface TabworthyTimes extends Components.TabworthyTimes, HTMLElement {}
export const TabworthyTimes: {
    prototype: TabworthyTimes;
    new (): TabworthyTimes;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
