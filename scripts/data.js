const DOS_TABLE_API = {
    BASE: 'https://tablebuilder.singstat.gov.sg/api/table/tabledata/',
    POPULATION_STRUCTURE: {
        2020: '17394',
        2010: '8537',
        2000: '8850'
    }
};

async function getCensusData(tableId) {
    let data = {};

    try {
        let resp = await axios.get(DOS_TABLE_API.BASE + tableId);
        data = resp.data;
    } catch (e) {
        console.log('Unable to get data of DOS census via singstag.gov.sg, attempting to use stored copy of', tableId);
    } finally {
        data = getStoredCensusData(tableId);
    }

    return data;
}

async function getStoredCensusData(tableId) {
    let data = {};

    try {
        let resp = await axios.get('assets/data/temp/' + tableId + '.json');
        data = resp.data;
    } catch (e) {
        console.error('Issue with DOS census stored copy', e);
    }

    return data;
}

function transformedCensusData(rawData) {

}