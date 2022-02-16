function displayPieChart(elementId, seriesArray, labelArray) {
    const options = {
        chart: {
            type: 'pie',
            height: "100%"
        },
        series: seriesArray,
        labels: labelArray
    }
    const pie = new ApexCharts(document.getElementById(elementId), options);
    pie.render();
}

function displayCensusCharts(censusSeries) {
    let censusYearsArr = Object.keys(censusSeries);

    displayPieChart('pie-race', [censusSeries['2020'].race.chinese, censusSeries['2020'].race.malay, censusSeries['2020'].race.indian, censusSeries['2020'].race.others], ['Chinese', 'Malay', 'Indian', 'Others']);
    displayPieChart('pie-gender', [censusSeries['2020'].gender.male, censusSeries['2020'].gender.female], ['Male', 'Female']);
    displayPieChart('pie-residency', [censusSeries['2020'].residency.citizen, censusSeries['2020'].residency.permanent], ['Citizen', 'Permanent Resident']);

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
}