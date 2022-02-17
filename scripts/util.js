const UTIL = {
    compareDesc: (a, b) => { return b - a; },
    compareAsc: (a, b) => { return a - b },
    getKeyByValue: (object, value) => {
        return Object.keys(object).find(key => object[key] === value);
    },
    convertToNumber: (value) => {
        return isNaN(value) || typeof value === 'undefined' ? 0 : value;
    }
}
const LABELS = {
    CITIZEN: 'Singapore Citizen',
    PR: 'Permanent Resident',
    NON_RES: 'Non-Resident',
    CITIZEN_PPLT: 'Singapore Citizen Population',
    PR_PPLT: 'Permanent Resident Population',
    NON_RES_PPLT: 'Non-Resident Population'
}