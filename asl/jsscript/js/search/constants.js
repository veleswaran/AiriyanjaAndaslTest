
export const MAX_CHARACTER_LEN = 80;
export const SPECIAL_FILTER_TYPES = Object.freeze(["nonkey"]);
export const FILTERS = Object.freeze({
    NONKEY: "nonkey",
    INT: "int",
    PINT: "pint",
    DECIMAL: "decimal",
    PDECIMAL: "pdecimal",
    POPER: "poper",
    DATE: "date",
});
export const FUNCTION_KEYS = Object.freeze(["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"]);
export const CONTROL_KEYS = Object.freeze(["Escape", "Tab", "Enter", "Shift", "Control", "Alt", "Meta"]);
export const NAVIGATION_KEYS = Object.freeze(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"]);
export const SPECIAL_KEYS = Object.freeze([...FUNCTION_KEYS, ...CONTROL_KEYS, ...NAVIGATION_KEYS]);