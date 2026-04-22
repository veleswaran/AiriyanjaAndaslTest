

export function toCurrencyF(data) {
    return parseFloat(parseFloat(data).toFixed(2))
}

export function toUnitF(data) {
    return parseFloat(parseFloat(data).toFixed(3))
}

export function toIndianCurrencyF(data) {
    const num = parseFloat(parseFloat(data).toFixed(2));
    // Format with Indian numbering system
    let formatted = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
    // Remove fraction if it's .00
    if (formatted.endsWith(".00")) {
        formatted = formatted.slice(0, -3);
    }

    return formatted;
}