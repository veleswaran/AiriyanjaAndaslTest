

export function isKeyAllowed(key, filters = {}, addedChips = []) {
    if (filters.hasOwnProperty(key)) {
        const { count = 1 } = filters[key];
        const totalAdded = addedChips.filter(item => item.key === key).length;
        return totalAdded < count;
    }
    return false;
}


export function getFilterKeyMatches(text = "", filters = {}, filterKeys = [], addedChips = []) {
    const typedKey = text.toLowerCase();
    const mathchings = Object.keys(filters).filter(key => {
        const isMatch = filterKeys.includes(key) && key.toLowerCase().startsWith(typedKey.toLowerCase());
        return isMatch ? isKeyAllowed(key, filters, addedChips) : false;
    });
    return mathchings;
}