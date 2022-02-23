const UTIL = {
    compareDesc: (a, b) => b - a,
    compareAsc: (a, b) => a - b,
    compareAlphaNumDesc: (a, b) => b.localeCompare(a, undefined, { numeric: true }),
    compareAlphaNumAsc: (a, b) => a.localeCompare(b, undefined, { numeric: true }),
    convertDOSKeys: str => str.trim().toLowerCase().replaceAll(/\s+/g, ' ').replaceAll(' ', '_'),
    convertToTitleCase: str => str.trim().toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' '),
    convertToNumber: (value) => isNaN(value) ? 0 : Number(value),
    getKeyByValue: (object, value) => Object.keys(object).find(key => object[key] === value)
}
const MAP_ZOOM_INITIAL = 12.4;
const CHART_TYPES = {
    AREA: 'area',
    BAR: 'bar',
    COLUMN: 'column',
    DONUT: 'donut',
    LINE: 'line',
    PIE: 'pie',
    RADIAL_BAR: 'radialBar'
}
const CHART_LABELS = {
    CITIZEN: 'Singapore Citizen',
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
    MALAYS: 'Malay',
    INDIANS: 'Indian',
    OTHERS: 'Other'
}
const ELEMENT_IDS = {
    POPULATION: 'population',
    RESIDENCY: 'residency',
    GENDER: 'gender',
    RACE: 'race',
    AGE_GROUP: 'age-group',
    MED_AGE_CITIZEN: 'mage-citizen',
    MED_AGE_RESIDENT: 'mage-resident'
}
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
}