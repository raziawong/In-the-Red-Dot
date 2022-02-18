function displayPieChart(type, elementId, seriesArray, labelArray) {
    const options = {
        chart: {
            type: type,
            height: "100%"
        },
        series: seriesArray,
        labels: labelArray
    }

    if (type == 'donut') {
        options.plotOptions = {
            pie: {
                donut: {
                    labels: {
                        total: {
                            show: true
                        }
                    }
                }
            }
        }
    }
    const pie = new ApexCharts(document.getElementById(elementId), options);
    pie.render();
}

function displayAnnualPopulationChart(populationData) {
    let years = populationData.ascYear.slice(-30);
    let yearData = populationData.dataByYear;

    //displayPieChart('donut', 'population-res', [yearData[latestYear][LABELS.SG_PPLT], yearData[latestYear][LABELS.PR_PPLT], yearData[latestYear][LABELS.NON_RES_PPLT]], [LABELS.SG_PPLT, LABELS.PR_PPLT, LABELS.NON_RES_PPLT]);

    var options = {
        series: [{
            name: LABELS.CITIZEN,
            data: years.map(y => { return UTIL.convertToNumber(yearData[y][LABELS.CITIZEN_PPLT]) })
        }, {
            name: LABELS.PR,
            data: years.map(y => { return UTIL.convertToNumber(yearData[y][LABELS.PR_PPLT]) })
        }, {
            name: LABELS.NON_RES,
            data: years.map(y => { return UTIL.convertToNumber(yearData[y][LABELS.PR_PPLT]) })
        }],
        chart: {
            type: 'bar',
            height: 700,
            stacked: true,
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        xaxis: {
            categories: years
        },
        legend: {
            position: 'top'
        },
        fill: {
            opacity: 1
        }
    };

    var chart = new ApexCharts(document.getElementById("population-stack"), options);
    chart.render();
}

function displayCensusCharts(censusSeries) {
    let censusYearsArr = Object.keys(censusSeries);

    displayPieChart('pie', 'pie-race', [censusSeries['2020'].race.chinese, censusSeries['2020'].race.malay, censusSeries['2020'].race.indian, censusSeries['2020'].race.others], ['Chinese', 'Malay', 'Indian', 'Others']);
    displayPieChart('pie', 'pie-gender', [censusSeries['2020'].gender.male, censusSeries['2020'].gender.female], ['Male', 'Female']);
    displayPieChart('pie', 'pie-residency', [censusSeries['2020'].residency.citizen, censusSeries['2020'].residency.permanent], ['Citizen', 'Permanent Resident']);

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