const DOS_TABLE_API = {
    BASE_URL: 'https://tablebuilder.singstat.gov.sg/api/table/tabledata/',
    STORE_URL: 'assets/data/temp/',
    ANNUAL_POP_ID: 'M810001',
    GEO_DISTRI_IDS: {
        dwellingType: '17574',
        ageGroup: '17560',
        ethnicGroup: '17561'
    },
    CENSUS_IDS: {
        2020: '17394',
        2010: '8537',
        2000: '8850'
    }
};

const DATA_GOV_API = {
    STORE_URL: 'assets/data/map'
}

async function getGeoDistributionData() {
    let promiseArr = [];
    let storedPromiseArr = [];
    let data = {};

    for (let prop in DOS_TABLE_API.GEO_DISTRI_IDS) {
        promiseArr.push(axios.get(DOS_TABLE_API.BASE_URL + DOS_TABLE_API.GEO_DISTRI_IDS[prop]));
        storedPromiseArr.push(axios.get(DOS_TABLE_API.STORE_URL + DOS_TABLE_API.GEO_DISTRI_IDS[prop] + '.json'))
    }

    await Promise.all(promiseArr).then(resp => {
        for (let r of resp) {
            if (Object.values(DOS_TABLE_API.GEO_DISTRI_IDS).includes(r.data.Data.id)) {
                data[UTIL.getKeyByValue(DOS_TABLE_API.GEO_DISTRI_IDS, r.data.Data.id)] = r.data.Data.row;
            }
        }
    }).catch(async error => {
        console.log('Unable to get data of DOS geographical distribution data via singstag.gov.sg, attempting to use stored copies');
        await Promise.all(storedPromiseArr).then(resp => {
            for (let r of resp) {
                if (Object.values(DOS_TABLE_API.GEO_DISTRI_IDS).includes(r.data.Data.id)) {
                    data[UTIL.getKeyByValue(DOS_TABLE_API.GEO_DISTRI_IDS, r.data.Data.id)] = r.data.Data.row;
                }
            }
        }).catch(error => {
            console.log('Unable to get data of DOS geographical distribution data stored copies');
        });
    });

    //console.log("Geographical Distribution Response:\n", data);
    return data;
}

async function getAnnualPopulationData() {
    let data = [];

    await axios.get(DOS_TABLE_API.BASE_URL + DOS_TABLE_API.ANNUAL_POP_ID).then(resp => {
        data = resp.data.Data.row;
    }).catch(async error => {
        console.log('Unable to get data of DOS annual population data via singstag.gov.sg, attempting to use stored copy');
        await axios.get(DOS_TABLE_API.STORE_URL + DOS_TABLE_API.ANNUAL_POP_ID + '.json').then(resp => {
            data = resp.data.Data.row;
        }).catch(error => {
            console.log('Unable to get data of DOS annual population data stored copy');
        });
    });

    //console.log("Annual Population Data Response:\n", data);
    return data;
}

async function getAllCensusData() {
    let promiseArr = [];
    let storedPromiseArr = [];
    let data = {};

    for (let prop in DOS_TABLE_API.CENSUS_IDS) {
        promiseArr.push(axios.get(DOS_TABLE_API.BASE_URL + DOS_TABLE_API.CENSUS_IDS[prop]));
        storedPromiseArr.push(axios.get(DOS_TABLE_API.STORE_URL + DOS_TABLE_API.CENSUS_IDS[prop] + '.json'))
    }

    await Promise.all(promiseArr).then(resp => {
        for (let r of resp) {
            if (Object.values(DOS_TABLE_API.CENSUS_IDS).includes(r.data.Data.id)) {
                data[UTIL.getKeyByValue(DOS_TABLE_API.CENSUS_IDS, r.data.Data.id)] = r.data.Data.row;
            }
        }
    }).catch(async error => {
        console.log('Unable to get data of DOS census via singstag.gov.sg, attempting to use stored copies');
        await Promise.all(storedPromiseArr).then(resp => {
            for (let r of resp) {
                if (Object.values(DOS_TABLE_API.CENSUS_IDS).includes(r.data.Data.id)) {
                    data[UTIL.getKeyByValue(DOS_TABLE_API.CENSUS_IDS, r.data.Data.id)] = r.data.Data.row;
                }
            }
        }).catch(error => {
            console.log('Unable to get data of DOS census stored copies');
        });
    });

    //console.log("Census Data Response:\n", data);
    return data;
}

function transformGeoDistributionData(rawData) {
    let dataByArea = {
        dwellingType: {},
        ageGroup: {},
        ethnicGroup: {},
        highestPopulationCount: 0
    };

    for (let row of rawData.dwellingType) {
        let areaName = row.rowText;

        for (let dwellingObj of row.columns) {
            let dataKey = dwellingObj['key'];
            let value = dwellingObj.hasOwnProperty('value') ? dwellingObj['value'] : (dwellingObj['columns'].find(hdb => hdb['key'].toLowerCase() === 'total'))['value'];
            value = UTIL.convertToNumber(value);
            if (dataKey.toLowerCase() !== 'total') {
                if (dataByArea.dwellingType.hasOwnProperty(areaName)) {
                    Object.assign(dataByArea.dwellingType[areaName], {
                        [dataKey]: value
                    });
                } else {
                    dataByArea.dwellingType[areaName] = {
                        [dataKey]: value
                    };
                }
            }
        }
    }

    let ageGroupByArea = rawData.ageGroup.filter(d => d['rowText'].toLowerCase().includes('total'));
    for (let row of ageGroupByArea) {
        let areaName = UTIL.convertToTitleCase(row.rowText.toLowerCase().replace('- total', '').trim());

        for (let ageGroupObj of row.columns[0].columns) {
            let dataKey = ageGroupObj['key'];
            let value = UTIL.convertToNumber(ageGroupObj['value']);

            if (areaName.toLowerCase() !== 'total' && dataKey.toLowerCase() == 'total' && value > dataByArea.highestPopulationCount) {
                dataByArea.highestPopulationCount = value;
            }

            if (dataByArea.ageGroup.hasOwnProperty(areaName)) {
                Object.assign(dataByArea.ageGroup[areaName], {
                    [dataKey]: value
                });
            } else {
                dataByArea.ageGroup[areaName] = {
                    [dataKey]: value
                };
            }
        }
    }

    let ethnicGroupByArea = rawData.ethnicGroup.filter(d => d['rowText'].toLowerCase().includes('total'));
    for (let row of ethnicGroupByArea) {
        let areaName = UTIL.convertToTitleCase(row.rowText.toLowerCase().replace('- total', '').trim());

        for (let ethnicObj of row.columns) {
            let dataKey = ethnicObj['key'];
            let value = UTIL.convertToNumber(ethnicObj.columns[0].value);

            if (areaName.toLowerCase() !== 'total' && dataKey.toLowerCase() == 'total' && value > dataByArea.highestPopulationCount) {
                dataByArea.highestPopulationCount = value;
            }

            if (dataByArea.ethnicGroup.hasOwnProperty(areaName)) {
                Object.assign(dataByArea.ethnicGroup[areaName], {
                    [dataKey]: value
                });
            } else {
                dataByArea.ethnicGroup[areaName] = {
                    [dataKey]: value
                };
            }
        }
    }

    //console.log("Geographical Distribution:\n", dataByArea);
    return dataByArea;
}

function transformAnnualPopulationData(rawData) {
    let dataByYear = {};
    for (let rowKey in rawData) {
        let row = rawData[rowKey];
        let dataKey = row['rowText'];

        for (let colKey in row.columns) {
            let col = row.columns[colKey];
            let year = col['key'];
            if (dataByYear.hasOwnProperty(year)) {
                dataByYear[year] = Object.assign(dataByYear[year], {
                    [dataKey]: UTIL.convertToNumber(col['value'])
                });
            } else {
                dataByYear[year] = {
                    [dataKey]: UTIL.convertToNumber(col['value'])
                };
            }
        }
    }

    let populationData = {
        ascYear: Object.keys(dataByYear).sort(UTIL.compareAsc),
        dataByYear: dataByYear
    }

    //console.log("Annual Population Indicators:\n", populationData);
    return populationData;
}

function transformCensusData(rawData) {
    let totalStructure = {};
    //let ageGroup = {};
    // let genderGroup = {};
    // let raceGroup = {};
    // let residency = {};

    for (let key in rawData) {
        let ageTotal = {};
        let year = Number(key);

        for (let ageData of rawData[key]) {
            let group = ageData.rowText.toLowerCase();

            if (year >= 2020 && group.includes('89')) {
                ageTotal['85 & over'] = UTIL.convertToNumber(ageData.columns[0].columns[0].columns[0].value);
            } else if (year >= 2020 && group.includes('90')) {
                ageTotal['85 & over'] += UTIL.convertToNumber(ageData.columns[0].columns[0].columns[0].value);
            } else if (group !== 'total') {
                ageTotal[ageData.rowText.toLowerCase()] = UTIL.convertToNumber(ageData.columns[0].columns[0].columns[0].value);
            }
        }

        totalStructure[key] = ({
            total: UTIL.convertToNumber(rawData[key][0].columns[0].columns[0].columns[0].value),
            gender: {
                male: UTIL.convertToNumber(rawData[key][0].columns[0].columns[0].columns[1].value),
                female: UTIL.convertToNumber(rawData[key][0].columns[0].columns[0].columns[2].value)
            },
            race: {
                chinese: UTIL.convertToNumber(rawData[key][0].columns[0].columns[1].columns[0].value),
                malay: UTIL.convertToNumber(rawData[key][0].columns[0].columns[2].columns[0].value),
                indian: UTIL.convertToNumber(rawData[key][0].columns[0].columns[3].columns[0].value),
                others: UTIL.convertToNumber(rawData[key][0].columns[0].columns[4].columns[0].value)
            },
            residency: {
                citizen: UTIL.convertToNumber(rawData[key][0].columns[1].columns[0].columns[0].value),
                permanent: UTIL.convertToNumber(rawData[key][0].columns[2].columns[0].columns[0].value)
            },
            age: ageTotal
        });
    }

    //console.log("Total Population Structure:\n", totalStructure);
    return totalStructure;
}