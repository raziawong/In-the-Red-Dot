const UTIL = {
    compareDesc: (a, b) => b - a,
    compareAsc: (a, b) => a - b,
    compareAlphabetically: (a, b) => a.localeCompare(b, undefined, { numeric: true }),
    convertToTitleCase: str => str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' '),
    convertToNumber: (value) => isNaN(value) ? 0 : Number(value),
    getKeyByValue: (object, value) => Object.keys(object).find(key => object[key] === value)
}
const LABELS = {
    CITIZEN: 'Singapore Citizen',
    PR: 'Permanent Resident',
    NON_RES: 'Non-Resident',
    CITIZEN_PPLT: 'Singapore Citizen Population',
    PR_PPLT: 'Permanent Resident Population',
    NON_RES_PPLT: 'Non-Resident Population'
}