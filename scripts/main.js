const MAP_ZOOM_INITIAL = 11;

function main() {

    function init() {
        window.addEventListener('DOMContentLoaded', async function() {
            let censusSeries = await initCensus();
            let censusYearsArr = Object.keys(censusSeries);

            console.log(censusSeries);

            const raceOpt = {
                chart: {
                    type: 'pie',
                    height: "100%"
                },
                series: [censusSeries['2020'].race.chinese, censusSeries['2020'].race.malay, censusSeries['2020'].race.indian, censusSeries['2020'].race.others],
                labels: ['Chinese', 'Malay', 'Indian', 'Others']
            }
            const racePie = new ApexCharts(document.getElementById('pie-race'), raceOpt);
            racePie.render();

            const genderOpt = {
                chart: {
                    type: 'pie',
                    height: "100%"
                },
                series: [censusSeries['2020'].gender.male, censusSeries['2020'].gender.female],
                labels: ['Male', 'Female']
            }
            const genderPie = new ApexCharts(document.getElementById('pie-gender'), genderOpt);
            genderPie.render();

            const resOpt = {
                chart: {
                    type: 'pie',
                    height: "100%"
                },
                series: [censusSeries['2020'].residency.citizen, censusSeries['2020'].residency.permanent],
                labels: ['Citizen', 'Permanent Resident']
            }
            const resPie = new ApexCharts(document.getElementById('pie-residency'), resOpt);
            resPie.render();

            const totalOpt = {
                chart: {
                    type: 'line',
                    height: "100%"
                },
                series: [{
                        name: 'Chinese',
                        data: censusYearsArr.map(k => censusSeries[k].race.chinese)
                    },
                    {
                        name: 'Malay',
                        data: censusYearsArr.map(k => censusSeries[k].race.malay)
                    },
                    {
                        name: 'Indian',
                        data: censusYearsArr.map(k => censusSeries[k].race.indian)
                    },
                    {
                        name: 'Others',
                        data: censusYearsArr.map(k => censusSeries[k].race.others)
                    }
                ],
                xaxis: {
                    categories: censusYearsArr
                }
            }
            const chart = new ApexCharts(document.getElementById('total'), totalOpt);
            chart.render();
        });
    }

    async function initCensus() {
        let rawData = await getAllCensusData();
        return transformedCensusData(rawData);
    }

    init();
}

main();