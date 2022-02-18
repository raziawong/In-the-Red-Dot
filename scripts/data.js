const DOS_TABLE_API = {
    BASE_URL: 'https://tablebuilder.singstat.gov.sg/api/table/tabledata/',
    STORE_URL: 'assets/data/temp/',
    ANNUAL_POP_ID: 'M810001',
    GEO_DISTRI_IDS: {
        AreaAndDwelling: '17574',
        AreaAndAgeGroup: '17560'
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

async function getSubzoneLayerData() {
    try {
        let resp = await axios.get(DATA_GOV_API.STORE_URL + '/2019_subzone.geojson');
        return resp.data;
    } catch (e) {
        console.error('Unable to get data of URA subzones');
        return false;
    }
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

    console.log("Geographical Distribution:\n", data);
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

    console.log("Annual Population Data Response:\n", data);
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

    console.log("Census Data Response:\n", data);
    return data;
}

function transformGeoDistributionData(rawData) {
    let dataByArea = {};
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
                    [dataKey]: Number(col['value'])
                });
            } else {
                dataByYear[year] = {
                    [dataKey]: Number(col['value'])
                };
            }
        }
    }

    let populationData = {
        ascYear: Object.keys(dataByYear).sort(UTIL.compareAsc),
        dataByYear: dataByYear
    }

    console.log("Annual Population Indicators:\n", populationData);
    return populationData;
}

function transformCensusData(rawData) {
    console.log('rawData', rawData);
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
                ageTotal['85 & over'] = Number(ageData.columns[0].columns[0].columns[0].value);
            } else if (year >= 2020 && group.includes('90')) {
                ageTotal['85 & over'] += Number(ageData.columns[0].columns[0].columns[0].value);
            } else if (group !== 'total') {
                ageTotal[ageData.rowText.toLowerCase()] = Number(ageData.columns[0].columns[0].columns[0].value);
            }
        }

        totalStructure[key] = ({
            total: Number(rawData[key][0].columns[0].columns[0].columns[0].value),
            gender: {
                male: Number(rawData[key][0].columns[0].columns[0].columns[1].value),
                female: Number(rawData[key][0].columns[0].columns[0].columns[2].value)
            },
            race: {
                chinese: Number(rawData[key][0].columns[0].columns[1].columns[0].value),
                malay: Number(rawData[key][0].columns[0].columns[2].columns[0].value),
                indian: Number(rawData[key][0].columns[0].columns[3].columns[0].value),
                others: Number(rawData[key][0].columns[0].columns[4].columns[0].value)
            },
            residency: {
                citizen: Number(rawData[key][0].columns[1].columns[0].columns[0].value),
                permanent: Number(rawData[key][0].columns[2].columns[0].columns[0].value)
            },
            age: ageTotal
        });
    }

    console.log("Total Population Structure:\n", totalStructure);
    return totalStructure;
}