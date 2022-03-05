async function getGeoDistributionData() {
    // let promiseArr = [];
    let storedPromiseArr = [];
    let data = {};

    // use stored copies instead due to referer policy of API
    for (let prop in DOS_TABLE_API.GEO_DISTRI_IDS) {
        // promiseArr.push(axios.get(DOS_TABLE_API.BASE_URL + DOS_TABLE_API.GEO_DISTRI_IDS[prop]));
        storedPromiseArr.push(axios.get(DOS_TABLE_API.STORE_URL + DOS_TABLE_API.GEO_DISTRI_IDS[prop] + '.json'))
    }

    await Promise.all(storedPromiseArr).then(resp => {
        for (let r of resp) {
            if (Object.values(DOS_TABLE_API.GEO_DISTRI_IDS).includes(r.data.Data.id)) {
                data[UTIL.getKeyByValue(DOS_TABLE_API.GEO_DISTRI_IDS, r.data.Data.id)] = r.data.Data.row;
            }
        }
    }).catch(error => {
        console.log('Unable to get data of DOS geographical distribution data stored copies');
    });

    console.log("Geographical Distribution Response:\n", data);
    return data;
}

function getObjModelForGeoDistribution(rawDataByCat, isAgeGroup) {
    let dataByCat = {};
    for (let rowObj of rawDataByCat) {
        let areaName = UTIL.convertToTitleCase(rowObj['rowText'].toLowerCase().replace('- total', '').trim());

        for (let colData of rowObj.columns) {
            let dataKey = colData['key'];
            let dataToAdd = {};

            if (isAgeGroup) {
                for (let data of colData.columns) {
                    let { key, value } = data;
                    dataToAdd[dataKey] = {...dataToAdd[dataKey], [key]: UTIL.convertToNumber(value) };
                }
            } else {
                if (colData.hasOwnProperty('value')) {
                    value = UTIL.convertToNumber(colData['value']);
                } else if (colData.hasOwnProperty('columns')) {
                    let obj = colData['columns'].find(i => i['key'].toLowerCase() == 'total');
                    value = obj ? UTIL.convertToNumber(obj['value']) : colData['columns'];
                }

                dataToAdd = {
                    [dataKey]: value
                };
            }

            dataByCat[areaName] = {...dataByCat[areaName], ...dataToAdd };
        }
    }

    return dataByCat;
}

function transformGeoDistributionData(rawData) {
    let dataByArea = { highestPopulationCount: 0 };
    let ageGroupByArea = rawData.ageGroup.filter(d => d['rowText'].toLowerCase().includes('total'));

    dataByArea.genderPopulation = getObjModelForGeoDistribution(ageGroupByArea, false);
    dataByArea.ageGroup = getObjModelForGeoDistribution(ageGroupByArea, true);
    dataByArea.ethnicGroup = getObjModelForGeoDistribution(rawData.ethnicGroup
        .filter(d => d['rowText'].toLowerCase().includes('total')), false);
    dataByArea.dwellingType = getObjModelForGeoDistribution(rawData.dwellingType, false);
    dataByArea.tenancyType = getObjModelForGeoDistribution(rawData.tenancyType, false);
    dataByArea.grossIncome = getObjModelForGeoDistribution(rawData.grossIncome, false);
    dataByArea.literacy = getObjModelForGeoDistribution(rawData.literacy, false);
    dataByArea.occupation = getObjModelForGeoDistribution(rawData.occupation);
    dataByArea.qualification = getObjModelForGeoDistribution(rawData.qualification, false);
    dataByArea.transportMode = getObjModelForGeoDistribution(rawData.transportMode, false);
    dataByArea.travelTime = getObjModelForGeoDistribution(rawData.travelTime, false);

    for (let areaData in dataByArea.genderPopulation) {
        if (areaData !== 'Total') {
            let areaPop = dataByArea.genderPopulation[areaData]['Total'];
            if (areaPop > dataByArea.highestPopulationCount) {
                dataByArea.highestPopulationCount = areaPop;
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

    // use stored copies instead due to referer policy of API
    for (let prop in DOS_TABLE_API.ANNUAL_POP_IDS) {
        // promiseArr.push(axios.get(DOS_TABLE_API.BASE_URL + DOS_TABLE_API.ANNUAL_POP_IDS[prop]), {
        //     headers: { 'crossDomain': true }
        // });
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

    console.log("Annual Population Data Response:\n", data);
    return data;
}

function transformAnnualPopulationData(rawData) {
    let dataByYear = {};

    for (let rowObj of rawData.indicators) {
        let dataKey = UTIL.convertDOSKeys(rowObj['rowText']);

        for (let colObj of rowObj.columns) {
            let year = colObj['key'];
            dataByYear[year] = {...dataByYear[year], [dataKey]: UTIL.convertToNumber(colObj['value']) };
        }
    }

    let prevSeriesNo = null;
    let prevDataKey = null;
    for (let rowObj of rawData.categories) {
        let dataKey = UTIL.convertDOSKeys(rowObj['rowText']);
        let seriesNo = rowObj['SeriesNo'];

        for (let colObj of rowObj.columns) {
            let year = colObj['Key'];

            if (seriesNo.startsWith(prevSeriesNo + '.')) {
                let breakDownKey = prevDataKey + '_age_breakdown';
                dataByYear[year][breakDownKey] = {...dataByYear[year][breakDownKey], [dataKey]: UTIL.convertToNumber(colObj['Value']) };
            } else {
                dataByYear[year] = {...dataByYear[year], [dataKey]: UTIL.convertToNumber(colObj['Value']) };
            }
        }

        prevDataKey = seriesNo.includes('.') ? prevDataKey : dataKey;
        prevSeriesNo = seriesNo.includes('.') ? prevSeriesNo : seriesNo;
    }

    let populationData = {
        ascYear: Object.keys(dataByYear).sort(UTIL.compareAlphaNumAsc),
        dataByYear: dataByYear
    }

    // console.log("Annual Population Indicators:\n", populationData);
    return populationData;
}