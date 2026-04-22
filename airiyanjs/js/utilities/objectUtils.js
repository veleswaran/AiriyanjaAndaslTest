export function objectToArray(obj = {}, keys = []) {
    return keys.map(key => obj[key]).filter(value => value !== undefined && value !== null);
}

export function objectToQueryString(obj) {
    if (typeof obj !== 'object' || obj === null) {
        throw new TypeError('Input must be a non-null object');
    }
    // Filter out undefined or null values
    const filteredEntries = Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null);
    return new URLSearchParams(filteredEntries).toString();
}


export function filterObject(obj = {}, keys = []) {
    return Object.fromEntries(
        keys.map(key => [key, obj[key]])
            .filter(([_, value]) => value !== undefined && value !== null)
    );
}

export function addSeperator(array = [], separator = "") {
    if (array.length === 0) {
        return [];
    }
    return array.flatMap(item => [separator, item]).slice(1);

}

export function toJsonString(obj) {
    return JSON.stringify(obj);
}

export function fromJsonString(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Invalid JSON string:", e);
        return null;
    }
}

// Convert string to hex
export function toHex(str) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Convert hex back to string
export function fromHex(hex) {
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}