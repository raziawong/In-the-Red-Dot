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

    console.log("Geographical Distribution Response:\n", data);
    return data;
}

function transformGeoDistributionData(rawData) {
    let dataByArea = {
        dwellingType: {},
        ageGroup: {},
        ethnicGroup: {},
        highestPopulationCount: 0
    };

    for (let rowObj of rawData.dwellingType) {
        let areaName = rowObj['rowText'];

        for (let dwellingObj of rowObj.columns) {
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
    for (let rowObj of ageGroupByArea) {
        let areaName = UTIL.convertToTitleCase(rowObj['rowText'].toLowerCase().replace('- total', '').trim());

        for (let ageGroupObj of rowObj.columns[0].columns) {
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
    for (let rowObj of ethnicGroupByArea) {
        let areaName = UTIL.convertToTitleCase(rowObj['rowText'].toLowerCase().replace('- total', '').trim());

        for (let ethnicObj of rowObj.columns) {
            let dataKey = ethnicObj['key'];
            let value = UTIL.convertToNumber(ethnicObj.columns[0]['value']);

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

    console.log("Geographical Distribution:\n", dataByArea);
    return dataByArea;
}

async function getAnnualPopulationData() {
    //let promiseArr = [];
    let storedPromiseArr = [];
    let data = {};

    // use stored copies instead due to limitation of returned results in API
    for (let prop in DOS_TABLE_API.ANNUAL_POP_IDS) {
        //promiseArr.push(axios.get(DOS_TABLE_API.BASE_URL + DOS_TABLE_API.ANNUAL_POP_IDS[prop]));
        storedPromiseArr.push(axios.get(DOS_TABLE_API.STORE_URL + DOS_TABLE_API.ANNUAL_POP_IDS[prop] + '.json'))
    }

    await Promise.all(storedPromiseArr).then(resp => {
        for (let r of resp) {
            if (Object.values(DOS_TABLE_API.ANNUAL_POP_IDS).includes(r.data.Data.id)) {
                data[UTIL.getKeyByValue(DOS_TABLE_API.ANNUAL_POP_IDS, r.data.Data.id)] = r.data.Data.row;
            }
        }
    }).catch(error => {
        console.log('Unable to get data of DOS annual population data stored copies');
    });

    // console.log("Annual Population Data Response:\n", data);
    return data;
}

function transformAnnualPopulationData(rawData) {
    let dataByYear = {};
    for (let rowObj of rawData['indicators']) {
        let dataKey = UTIL.convertDOSKeys(rowObj['rowText']);

        for (let colObj of rowObj.columns) {
            let year = colObj['key'];
            if (dataByYear.hasOwnProperty(year)) {
                dataByYear[year] = Object.assign(dataByYear[year], {
                    [dataKey]: UTIL.convertToNumber(colObj['value'])
                });
            } else {
                dataByYear[year] = {
                    [dataKey]: UTIL.convertToNumber(colObj['value'])
                };
            }
        }
    }

    let prevSeriesNo = null;
    let prevDataKey = null;
    for (let rowObj of rawData['categories']) {
        let dataKey = UTIL.convertDOSKeys(rowObj['rowText']);
        let seriesNo = rowObj['SeriesNo'];

        for (let colObj of rowObj.columns) {
            let year = colObj['Key'];

            if (seriesNo.startsWith(prevSeriesNo + '.')) {
                let breakDownKey = prevDataKey + '_age_breakdown';

                if (dataByYear[year].hasOwnProperty(breakDownKey)) {
                    dataByYear[year][breakDownKey] = Object.assign(dataByYear[year][breakDownKey], {
                        [dataKey]: UTIL.convertToNumber(colObj['Value'])
                    });
                } else {
                    dataByYear[year][breakDownKey] = {
                        [dataKey]: UTIL.convertToNumber(colObj['Value'])
                    };
                }
            } else {
                if (dataByYear.hasOwnProperty(year)) {
                    dataByYear[year] = Object.assign(dataByYear[year], {
                        [dataKey]: UTIL.convertToNumber(colObj['Value'])
                    });
                } else {
                    dataByYear[year] = {
                        [dataKey]: UTIL.convertToNumber(colObj['Value'])
                    };
                }
            }
        }

        prevDataKey = seriesNo.includes('.') ? prevDataKey : dataKey;
        prevSeriesNo = seriesNo.includes('.') ? prevSeriesNo : seriesNo;
    }

    let populationData = {
        ascYear: Object.keys(dataByYear).sort(UTIL.compareAsc),
        dataByYear: dataByYear
    }

    // console.log("Annual Population Indicators:\n", populationData);
    return populationData;
}