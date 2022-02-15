const DOS_TABLE_API = {
    BASE_URL: 'https://tablebuilder.singstat.gov.sg/api/table/tabledata/',
    STORE_URL: 'assets/data/temp/',
    POPULATION_STRUCTURE: {
        2020: 17394,
        2010: 8537,
        2000: 8850
    }
};

async function getAllCensusData() {
    let promiseArr = [];
    let storedPromiseArr = [];
    let censusData = {};

    for (let prop in DOS_TABLE_API.POPULATION_STRUCTURE) {
        promiseArr.push(axios.get(DOS_TABLE_API.BASE_URL + DOS_TABLE_API.POPULATION_STRUCTURE[prop]));
        storedPromiseArr.push(axios.get(DOS_TABLE_API.STORE_URL + DOS_TABLE_API.POPULATION_STRUCTURE[prop] + '.json'))
    }

    await Promise.all(promiseArr).then(resp => {
        for (let r of resp) {
            if (Object.values(DOS_TABLE_API.POPULATION_STRUCTURE).includes(r.data.ID)) {
                censusData[util.getKeyByValue(DOS_TABLE_API.POPULATION_STRUCTURE, r.data.ID)] = r.data.row;
            }
        }
    }).catch(async error => {
        console.log('Unable to get data of DOS census via singstag.gov.sg, attempting to use stored copies');
        await Promise.all(storedPromiseArr).then(resp => {
            for (let r of resp) {
                if (Object.values(DOS_TABLE_API.POPULATION_STRUCTURE).includes(r.data.ID)) {
                    censusData[util.getKeyByValue(DOS_TABLE_API.POPULATION_STRUCTURE, r.data.ID)] = r.data.row;
                }
            }
        }).catch(error => {
            console.log('Unable to get data of DOS census stored copies');
        });
    });

    console.log("Census Data Response:", censusData);
    return censusData;
}

function transformedCensusData(rawData) {
    let totalStructure = {};
    // let ageGroup = {};
    // let genderGroup = {};
    // let raceGroup = {};
    // let residency = {};

    for (let key in rawData) {
        totalStructure[key] = {
            total: Number(rawData[key][0].columns[0].columns[0].columns[0].Value),
            gender: {
                male: Number(rawData[key][0].columns[0].columns[0].columns[1].Value),
                female: Number(rawData[key][0].columns[0].columns[0].columns[2].Value)
            },
            race: {
                chinese: Number(rawData[key][0].columns[0].columns[1].columns[0].Value),
                malay: Number(rawData[key][0].columns[0].columns[2].columns[0].Value),
                indian: Number(rawData[key][0].columns[0].columns[3].columns[0].Value),
                others: Number(rawData[key][0].columns[0].columns[4].columns[0].Value)
            },
            residency: {
                citizen: Number(rawData[key][0].columns[1].columns[0].columns[0].Value),
                permanent: Number(rawData[key][0].columns[2].columns[0].columns[0].Value)
            }

        };
    }

    console.log("Total Population Structure:", totalStructure);
    return totalStructure;
}