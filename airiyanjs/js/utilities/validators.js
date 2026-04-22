
export function zeroOrPositiveValidator(val) {
    const finalVal = Number(val);
    if (finalVal >= 0) {
        return true;
    }
    return false;
}

export function positiveValidator(val) {
    const finalVal = Number(val);
    if (finalVal > 0) {
        return true;
    }
    return false;
}

export function percentageValidator(val) {
    const finalVal = Number(val);
    if (finalVal >= 0 && finalVal <= 100) {
        return true;
    }
    return false;
}

export function stringNotNullOrEmpty(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data) {
        return false;
    }
    return true;
}

export function mobileValidator(val) {
    const regex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    return regex.test(val);
}

export function emailValidatorSimple(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export function emailValidatorRFC5322(email) {
    const rfc5322Regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return rfc5322Regex.test(email);
}

export function alphaNumericValidator(str) {
    const regex = /^[a-z0-9]+$/i;
    return regex.test(str);
}

export function numberValidator(str) {
    const regex = /^[0-9]+$/;
    return regex.test(str);
}

export function indianPostalCodeValidator(str) {
    const regex = /^[1-9]\d{2}\d{3}$/;
    return regex.test(str);
}

export function indianGSTINValidator(gstin) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(gstin)) return false;

    let sum = 0;
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < 14; i++) {
        let val = chars.indexOf(gstin[i]);
        let factor = (i % 2 === 0) ? 1 : 2;
        let multiplied = val * factor;
        sum += Math.floor(multiplied / 36) + (multiplied % 36);
    }

    let checkDigit = (36 - (sum % 36)) % 36;
    return gstin[14] === chars[checkDigit];
}

export function gstVehicleNumberValidator(number) {
    number = number.toUpperCase();
    // India - Standard
    const indiaStandard = /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{1,4}$/;
    // India - Bharat series (BH)
    const indiaBH = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}BH$/;
    // India - Temporary registration (TR)
    const indiaTemp = /^TR\d{6}$/;
    // Nepal - formats like BA1234 or BA2CHA1234
    const nepal = /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{1,4}$/;
    // Bhutan - formats like BP1234
    const bhutan = /^[A-Z]{2}\d{1,4}$/;
    return (
        indiaStandard.test(number) ||
        indiaBH.test(number) ||
        indiaTemp.test(number) ||
        nepal.test(number) ||
        bhutan.test(number)
    );
}