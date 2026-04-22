export const wildcardProcessor = (value) => {
    if (typeof value === "string") {
        if(value.includes("%") || value.includes("_")) {
            return value;
        }
        return `%${value}%`;
    }
}