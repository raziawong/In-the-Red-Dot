const MAP_ZOOM_INITIAL = 11;

function main() {

    function init() {

        window.addEventListener('DOMContentLoaded', async function() {
            let censusSeries = await initCensus();
            displayCensusCharts(censusSeries);
        });
    }

    async function initPopulation() {
        let rawData = await getAnnualPopulationData();
        let populationSeries = transformAnnualPopulationData(rawData);
        return populationSeries;
    }

    async function initCensus() {
        let rawData = await getAllCensusData();
        let censusSeries = transformCensusData(rawData);
        return censusSeries;
    }

    init();
}

main();