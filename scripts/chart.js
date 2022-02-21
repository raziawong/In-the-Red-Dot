function displaySingleChart(type, isStack, title, seriesArray, labelArray, elementId) {
    let options = {
        chart: {
            type: type,
            stacked: isStack
        },
        title: {
            text: title
        },
        series: seriesArray,
        labels: labelArray
    }

    new ApexCharts(document.getElementById(elementId), options).render();
}

function displayResidencySparkLines(id, name, labels, seriesData, subtitle) {
    let options = {
        chart: {
            id: id,
            group: 'residency',
            type: 'area',
            sparkline: {
                enabled: true
            },
        },
        stroke: {
            curve: 'smooth'
        },
        series: [{
            name: name,
            data: seriesData
        }],
        labels: labels,
        title: {
            text: name
        },
        subtitle: {
            text: subtitle
        }
    };

    new ApexCharts(document.getElementById(id), options).render();
}

function renderAnnualPopulationChart(populationData) {
    let years = populationData.ascYear.slice(-10);
    let yearData = populationData.dataByYear;
    let latestData = yearData[years[years.length - 1]];

    displayResidencySparkLines(
        'citizen-trend',
        CHART_LABELS.CITIZEN,
        years,
        years.map(y => { return yearData[y][DOS_DATA_KEYS.CITIZEN_PPLT] }),
        'Latest number: ' + latestData[DOS_DATA_KEYS.CITIZEN_PPLT]
    );

    displayResidencySparkLines(
        'pr-trend',
        CHART_LABELS.PR,
        years,
        years.map(y => { return yearData[y][DOS_DATA_KEYS.PR_PPLT] }),
        'Latest number: ' + latestData[DOS_DATA_KEYS.PR_PPLT]
    );

    displayResidencySparkLines(
        'nonres-trend',
        CHART_LABELS.NON_RES,
        years,
        years.map(y => { return yearData[y][DOS_DATA_KEYS.NON_RES_PPLT] }),
        'Latest number: ' + latestData[DOS_DATA_KEYS.NON_RES_PPLT]
    );

    displaySingleChart(
        'bar',
        true,
        'Median Age Insights', [{
                name: CHART_LABELS.CITIZEN,
                data: years.map(y => {
                    return yearData[y][DOS_DATA_KEYS.MED_AGE_CITIZEN] ? yearData[y][DOS_DATA_KEYS.MED_AGE_CITIZEN] : 0;
                })
            },
            {
                name: CHART_LABELS.RESIDENT,
                data: years.map(y => {
                    return yearData[y][DOS_DATA_KEYS.MED_AGE_RESIDENT] ? yearData[y][DOS_DATA_KEYS.MED_AGE_RESIDENT] : 0;
                })
            }
        ],
        years,
        'age-trend'
    );

    displaySingleChart(
        'area',
        true,
        'Population Growth Insights', [{
                name: CHART_LABELS.RATE_NATURAL_INCR,
                data: years.map(y => {
                    return yearData[y][DOS_DATA_KEYS.RATE_NATURAL_INCR] ? yearData[y][DOS_DATA_KEYS.RATE_NATURAL_INCR] : 0;
                })
            },
            {
                name: CHART_LABELS.RATE_POPLT_INCR,
                data: years.map(y => {
                    return yearData[y][DOS_DATA_KEYS.TOTAL_PPLT_GROWTH] ? yearData[y][DOS_DATA_KEYS.TOTAL_PPLT_GROWTH] : 0;
                })
            }
        ],
        years,
        'increase-trend'
    );

    // var options = {
    //     series: [{
    //         name: LABELS.CITIZEN,
    //         data: years.map(y => { return UTIL.convertToNumber(yearData[y][LABELS.CITIZEN_PPLT]) })
    //     }, {
    //         name: LABELS.PR,
    //         data: years.map(y => { return UTIL.convertToNumber(yearData[y][LABELS.PR_PPLT]) })
    //     }, {
    //         name: LABELS.NON_RES,
    //         data: years.map(y => { return UTIL.convertToNumber(yearData[y][LABELS.PR_PPLT]) })
    //     }],
    //     chart: {
    //         type: 'bar',
    //         height: 700,
    //         stacked: true,
    //         zoom: {
    //             enabled: true
    //         }
    //     },
    //     responsive: [{
    //         breakpoint: 480,
    //         options: {
    //             legend: {
    //                 position: 'bottom',
    //                 offsetX: -10,
    //                 offsetY: 0
    //             }
    //         }
    //     }],
    //     plotOptions: {
    //         bar: {
    //             horizontal: true
    //         }
    //     },
    //     xaxis: {
    //         categories: years
    //     },
    //     legend: {
    //         position: 'top'
    //     },
    //     fill: {
    //         opacity: 1
    //     }
    // };

    // var chart = new ApexCharts(document.getElementById("population-stack"), options);
    // chart.render();
}