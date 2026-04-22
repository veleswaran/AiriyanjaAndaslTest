
export function nameValidator(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 2 || data.length > 100) {
        return false;
    }
    return true;
}

export function nameValidatorChips(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 2 || data.length > 50) {
        return false;
    }
    return true;
}

export function cityValidator(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 2 || data.length > 50) {
        return false;
    }
    return true;
}

export function ad1Validator(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 5 || data.length > 120) {
        return false;
    }
    return true;
}

export function ad2Validator(data) {
    if (data !== null && data.length > 120) {
        return false;
    }
    return true;
}

export const dateValidator = (val) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return regex.test(val);
};