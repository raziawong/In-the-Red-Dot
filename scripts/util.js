const UTIL = {
    compareDesc: (a, b) => b - a,
    compareAsc: (a, b) => a - b,
    compareAlphabetically: (a, b) => a.localeCompare(b, undefined, { numeric: true }),
    convertToTitleCase: str => str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' '),
    convertToNumber: (value) => isNaN(value) ? 0 : Number(value),
    getKeyByValue: (object, value) => Object.keys(object).find(key => object[key] === value)
}
const CHART_LABELS = {
    CITIZEN: 'Singapore Citizen',
    RESIDENT: 'Resident',
    PR: 'Permanent Resident',
    NON_RES: 'Non-Resident',
    RATE_NATURAL_INCR: 'Rate of Natural Increase',
    RATE_POPLT_INCR: 'Rate of Population Growth',
}
const DOS_DATA_KEYS = {
    CITIZEN_PPLT: 'Singapore Citizen Population',
    PR_PPLT: 'Permanent Resident Population',
    NON_RES_PPLT: 'Non-Resident Population',
    RATE_NATURAL_INCR: 'Rate Of Natural Increase',
    TOTAL_PPLT_GROWTH: 'Total Population Growth',
    MED_AGE_CITIZEN: 'Median Age Of Citizen Population',
    MED_AGE_RESIDENT: 'Median Age Of Resident Population'
}