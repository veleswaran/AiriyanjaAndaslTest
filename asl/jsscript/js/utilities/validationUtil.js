

export function validateInt(value, isPositive = false) {
    if (isPositive) {
        return /^\d+$/.test(value)
    }
    return /^[-]?\d+$/.test(value);
}

export function validatePInt(value) {
    return validateInt(value, true);
}

export function validateDecimal(value, isPositive = false) {
    const decimalRegex = isPositive ? /^\d+(\.\d+)?$/ : /^-?\d+(\.\d+)?$/;
    return decimalRegex.test(value);
}

export function validatePDecimal(value, isPositive = false) {
    return validateDecimal(value, true);
}
