const UTIL = {
    compareAsc: (a, b) => b - a,
    compareDesc: (a, b) => a - b,
    compareAlphaNumAsc: (a, b) => a.localeCompare(b, undefined, { numeric: true }),
    compareAlphaNumDesc: (a, b) => b.localeCompare(a, undefined, { numeric: true }),
    convertDOSKeys: str => str.trim().toLowerCase().replaceAll(/\s+/g, ' ').replaceAll(' ', '_'),
    convertToTitleCase: str => str.trim().toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' '),
    convertToNumber: (value) => isNaN(value) ? null : Number(value),
    getKeyByValue: (object, value) => Object.keys(object).find(key => object[key] === value)
};
const DATA_GOV_API = {
    STORE_URL: 'assets/data/map'
};
const DOS_TABLE_API = {
    BASE_URL: 'https://tablebuilder.singstat.gov.sg/api/table/tabledata/',
    STORE_URL: 'assets/data/temp/',
    ANNUAL_POP_IDS: {
        indicators: 'M810001',
        categories: 'M810011'
    },
    GEO_DISTRI_IDS: {
        ageGroup: '17560',
        ethnicGroup: '17561',
        qualification: '17568',
        grossIncome: '17571',
        travelTime: '17573',
        dwellingType: '17574',
        literacy: '17591',
        occupation: '17593',
        transportMode: '17594'
    }
};
const DOS_DATA_KEYS = {
    CITIZEN_PPLT: 'singapore_citizen_population',
    PR_PPLT: 'permanent_resident_population',
    NON_RES_PPLT: 'non-resident_population',
    TOTAL_PPLT: 'total_population',
    RATE_NATURAL_INCR: 'rate_of_natural_increase',
    TOTAL_PPLT_GROWTH: 'total_population_growth',
    MED_AGE_CITIZEN: 'median_age_of_citizen_population',
    MED_AGE_RESIDENT: 'median_age_of_resident_population',
    AGE_DEP_15_64: 'age_dependency_ratio:_residents_aged_under_15_years_and_65_years_per_hundred_residents_aged_15-64_years',
    AGE_DEP_20_64: 'age_dependency_ratio:_residents_aged_under_20_years_and_65_years_&_over_per_hundred_residents_aged_20-64_years',
    CHILD_DEP_15_64: 'child_dependency_ratio:_residents_aged_under_15_years_per_hundred_residents_aged_15-64_years',
    CHILD_DEP_20_64: 'child_dependency_ratio:_residents_aged_under_20_years_per_hundred_residents_aged_20-64_years',
    OLD_DEP_15_64: 'old-age_dependency_ratio:_residents_aged_65_years_&_over_per_hundred_residents_aged_15-64_years',
    OLD_DEP_20_64: 'old-age_dependency_ratio:_residents_aged_65_years_&_over_per_hundred_residents_aged_20-64_years',
    TOTAL_MALE: 'total_male_residents',
    TOTAL_MALE_AGE: 'total_male_residents_age_breakdown',
    TOTAL_FEMALE: 'total_female_residents',
    TOTAL_FEMALE_AGE: 'total_female_residents_age_breakdown',
    SEX_RATIO: 'sex_ratio',
    TOTAL_CHINESE: 'total_chinese',
    TOTAL_MALAYS: 'total_malays',
    TOTAL_INDIANS: 'total_indians',
    TOTAL_OTHER_ETHN: 'other_ethnic_groups_(total)'
};
const CHART_CONF = {
    COLOR_RANGE: ['#c6b04f', '#8a45be', '#78c75c', '#c15a8e', '#95bdb1', '#c55940', '#6a6aa1', '#4e4535']
}
const CHART_TYPES = {
    AREA: 'area',
    BAR: 'bar',
    COLUMN: 'column',
    DONUT: 'donut',
    LINE: 'line',
    PIE: 'pie',
    POLAR_AREA: 'polarArea',
    RADAR: 'radar',
    RADIAL_BAR: 'radialBar',
    TREE_MAP: 'treemap'
};
const CHART_LABELS = {
    TOTAL: 'Total',
    POPULATION: 'Population',
    CITIZEN: 'Citizen',
    RESIDENT: 'Resident',
    PR: 'Permanent Resident',
    NON_RES: 'Non-Resident',
    RATE_NATURAL_INCR: 'Rate of Natural Increase',
    RATE_POPLT_INCR: 'Rate of Population Growth',
    AGE_DEP_15_64: 'Age Dependency: < 15 and 60 years old per 100 aged 15-64 years',
    AGE_DEP_20_64: 'Age Dependency: < 15 and 60 years old per 100 aged 20-64 years',
    CHILD_DEP_15_64: 'Child Dependency: < 15 years old per 100 aged 15-64 years',
    CHILD_DEP_20_64: 'Child Dependency: < 20 years old per 100 aged 20-64 years',
    OLD_DEP_15_64: 'Old Age Dependency: > 65 years old per 100 aged 15-64 years',
    OLD_DEP_20_64: 'Old Age Dependency: > 65 years old per 100 aged 20-64 years',
    MALE: 'Male',
    FEMALE: 'Female',
    GENDER_RATIO: 'Gender Ratio',
    CHINESE: 'Chinese',
    MALAYS: 'Malays',
    INDIANS: 'Indians',
    OTHERS: 'Others',
    CONDO: 'Condo/Apartments',
    HDB: 'HDB',
    LANDED: 'Landed',
    NONE: 'None',
    PRIMARY: 'Primary',
    LOW_SEC: 'Lower Sec.',
    SECONDARY: 'Secondary',
    POLYTECHNIC: 'Polytechnic',
    POST_SEC: 'Post Sec.',
    PROFESSIONAL: 'Professional',
    UNIVERSITY: 'University',
    LITERATE: 'Literate',
    NOT_LIT: 'Not Literate',
    LIT_ONE: '1 Language',
    LIT_TWO: '2 Languages',
    LIT_THREE: '>= 3 Languages',
    CAR: 'Car',
    LORRY: 'Lorry',
    TRAIN_BUS: 'Train & Public Bus',
    TRAIN: 'Train',
    MOTORCYCLE: 'Motorcycle',
    TRAIN_BUS_OTHERS: 'Train or Public Bus with Others',
    PRIVATE_BUS: 'Private Bus',
    PUBLIC_BUS: 'Public Bus',
    PRIVATE_HIRE_CAR: 'Private Hire Car'
};
const CHART_TITLES = {
    RESIDENCY: 'Residency',
    GENDER: 'Gender',
    ETHNICITY: 'Ethnicity',
    AGE_GROUP: 'Age Group',
    MEDIAN_AGE: 'Median Age',
    MEDIAN_AGE_INS: 'Median Age Insights',
    AGE_DEPENDENCY_RATIO: 'Age Dependency Ratio Insights',
    POP_GROWTH: 'Population Growth Insights',
    DWELLING_TYPE: 'Dwelling Type',
    QUALIFICATION: 'Qualification',
    LITERACY: 'Literacy',
    OCCUPATION: 'Occupation',
    INCOME: 'Income',
    TRANSPORT: 'Transport Mode',
    TRAVEL_TIME: 'Travel Time'
}
const MAP_CONF = {
    ZOOM_INITIAL: 12.4,
    DEFAULT_BORDER_COLOR: 'grey',
    HOVER_BORDER_COLOR: '#F6AE2D',
    CLICK_BORDER_COLOR: '#E73340',
    COLOR_RANGE: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
};
const MAP_LAYER_PROPS = {
    POPULATION: 'population',
    AGE_GROUP: 'ageGroup',
    ETHNIC_GROUP: 'ethnicGroup',
    GENDER_POP: 'genderPopulation',
    DISPLAY_NAME: 'display_name',
    TOTAL: 'Total',
    FEMALES: 'Females',
    MALES: 'Males',
    CONDO_OTH: 'Condominiums and Other Apartments',
    HDB_DWELL: 'HDB Dwellings',
    LANDED_PROP: 'Landed Properties',
    OTHERS: 'Others',
    CHINESE: 'Chinese',
    MALAYS: 'Malays',
    INDIANS: 'Indians',
    OTHERS: 'Others',
    NO_QUALIFICATION: 'No Qualification',
    PRIMARY: 'Primary',
    LOW_SECONDARY: 'Lower Secondary',
    SECONDARY: 'Secondary',
    POLYTECHNIC: 'Polytechnic Diploma',
    POST_SEC: 'Post-Secondary (Non-Tertiary)',
    PROFESSIONAL: 'Professional Qualification and Other Diploma',
    UNIVERSITY: 'University',
    NOT_LIT: 'Not Literate',
    LIT: 'Literate',
    ONE_LANG: 'One Language Only',
    TWO_LANG: 'Two Languages Only',
    THREE_LANG: 'Three or More Languages',
    CAR: 'Car Only',
    LORRY_PICKUP: 'Lorry/Pickup Only',
    MRT_LRT_BUS: 'MRT/LRT & Public Bus Only',
    MRT_LRT: 'MRT/LRT Only',
    MOTORCYCLE_SCOOTER: 'Motorcycle/\nScooter Only',
    NO_TRANSPORT_REQ: 'No Transport Required',
    OTHER_MRT_LRT_BUS: 'Other combinations of MRT/LRT or Public Bus',
    PRIVATE_BUS_VAN: 'Private Chartered Bus/Van Only',
    PUBLIC_BUS: 'Public Bus Only',
    PRIVATE_HIRE_CAR: 'Taxi/Private Hire Car Only'
};
const ELEMENT_IDS = {
    SIDEBAR_CLOSE: 'sidebar-close',
    SECT_OVERVIEW: 'overview',
    SECT_TREND: 'trend',
    SECT_PLAN_AREA: 'plan-area',
    OVERVIEW_SEL_YEAR: 'overview-sel-year',
    POPULATION: 'population',
    RESIDENCY: 'residency',
    RACE: 'race',
    GENDER: 'gender',
    MED_AGE: 'med-age',
    AGE_GROUP: 'age-group',
    TREND_SEL: 'trend-sel',
    TREND_SEL_FROM: 'trend-sel-from',
    TREND_SEL_TO: 'trend-sel-to',
    TREND_GENDER: 'trend-gender',
    TREND_RACE: 'trend-race',
    TREND_AGE: 'trend-age',
    TREND_DEPENDENCY: 'trend-dependecy',
    TREND_CITIZEN: 'trend-citizen',
    TREND_PR: 'trend-pr',
    TREND_NONRES: 'trend-nonres',
    TREND_POPINCR: 'trend-popincr',
    URA_ZONES_MAP: 'ura-zones-map',
    MAP_INFO: 'map-info',
    MAP_AREA_INFO: 'area-info',
    GEO_AGE_GROUP: 'geo-age-group',
    GEO_AGE_GENDER: 'geo-age-gender',
    GEO_RACE: 'geo-race',
    GEO_EDUCATION: 'geo-education',
    GEO_LITERACY: 'geo-literacy',
    GEO_OCCUPATION: 'geo-occupation',
    GEO_DWELLING: 'geo-dwelling',
    GEO_INCOME: 'geo-income',
    GEO_TRANSPORT: 'geo-transport',
    GEO_TRAVEL: 'geo-travel'
};
const ELEMENT_STATES = {
    ACTIVE: 'active',
    DISABLED: 'disabled',
    SELECTED: 'selected'
}
const ERROR_MSG = {
    YEAR_2: 'Please select years in range of 2 or more.',
    YEAR_10: 'Please select years in range of 10 or less.',
    YEAR_NEG: 'Please select a valid range (at least 2 years and within 10 years).'
}