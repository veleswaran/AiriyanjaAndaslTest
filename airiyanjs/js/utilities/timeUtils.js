
export function convertToIST(createdTime) {
    if (!createdTime || createdTime === "") {
        return ""
    }
    const cleanedIso = createdTime.replace('[UTC]', '');
    const date = new Date(cleanedIso);
    const istDateTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).format(date);
    return istDateTime;
}


export function convertToISTDate(createdTime) {
    if (!createdTime || createdTime === "") {
        return ""
    }
    const cleanedIso = createdTime.replace('[UTC]', '');
    const date = new Date(cleanedIso);
    const istDate = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(date);
    return istDate;
}

export function utcStringToDate(createdTime) {
    if (!createdTime || createdTime === "") {
        return ""
    }
    const cleanedIso = createdTime.replace('[UTC]', '');
    const date = new Date(cleanedIso);
    return date;
}

export function isWithinNdays(dateToCheck, within, currentDate = new Date()) {
    if (!dateToCheck instanceof Date || isNaN(dateToCheck.getTime())) {
        throw new Error("Invalid date provided!");
    }
    const now = currentDate;
    const ago = new Date();
    ago.setDate(now.getDate() + within);
    return dateToCheck >= ago && dateToCheck <= now;
}
