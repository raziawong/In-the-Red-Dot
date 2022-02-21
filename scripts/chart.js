function getYearSeriesChartData(years, data, key) {
    let series = years.map(y => {
        return data[y][key] ? data[y][key] : null;
    });
    return series;
}

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

    displaySingleChart(
        'bar',
        false,
        'Gender', [{
            name: CHART_LABELS.MALE,
            data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.TOTAL_MALE)
        }, {
            name: CHART_LABELS.FEMALE,
            data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.TOTAL_FEMALE)
        }],
        years,
        'gender-trend'
    );

    displaySingleChart(
        'bar',
        true,
        'Ethnicity', [{
                name: CHART_LABELS.CHINESE,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.TOTAL_CHINESE)
            }, {
                name: CHART_LABELS.MALAYS,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.TOTAL_MALAYS)
            }, {
                name: CHART_LABELS.INDIANS,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.TOTAL_INDIANS)
            },
            {
                name: CHART_LABELS.OTHERS,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.TOTAL_OTHER_ETHN)
            }
        ],
        years,
        'race-trend'
    );

    displaySingleChart(
        'bar',
        true,
        'Median Age Insights', [{
                name: CHART_LABELS.CITIZEN,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.MED_AGE_CITIZEN)
            },
            {
                name: CHART_LABELS.RESIDENT,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.MED_AGE_RESIDENT)
            }
        ],
        years,
        'age-trend'
    );

    displaySingleChart(
        'line',
        false,
        'Age Dependency Ratio Insights', [{
                name: CHART_LABELS.AGE_DEP_15_64,
                type: 'column',
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.AGE_DEP_15_64)
            },
            {
                name: CHART_LABELS.AGE_DEP_20_64,
                type: 'column',
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.AGE_DEP_20_64)
            },
            {
                name: CHART_LABELS.CHILD_DEP_15_64,
                type: 'area',
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.CHILD_DEP_15_64)
            },
            {
                name: CHART_LABELS.CHILD_DEP_20_64,
                type: 'area',
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.CHILD_DEP_20_64)
            },
            {
                name: CHART_LABELS.OLD_DEP_15_64,
                type: 'line',
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.OLD_DEP_15_64)
            },
            {
                name: CHART_LABELS.OLD_DEP_20_64,
                type: 'line',
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.OLD_DEP_20_64)
            }
        ],
        years,
        'dependency-trend'
    );

    displayResidencySparkLines(
        'citizen-trend',
        CHART_LABELS.CITIZEN,
        years,
        getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.CITIZEN_PPLT),
        'Latest number: ' + latestData[DOS_DATA_KEYS.CITIZEN_PPLT]
    );

    displayResidencySparkLines(
        'pr-trend',
        CHART_LABELS.PR,
        years,
        getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.PR_PPLT),
        'Latest number: ' + latestData[DOS_DATA_KEYS.PR_PPLT]
    );

    displayResidencySparkLines(
        'nonres-trend',
        CHART_LABELS.NON_RES,
        years,
        getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.NON_RES_PPLT),
        'Latest number: ' + latestData[DOS_DATA_KEYS.NON_RES_PPLT]
    );

    displaySingleChart(
        'area',
        true,
        'Population Growth Insights', [{
                name: CHART_LABELS.RATE_NATURAL_INCR,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.RATE_NATURAL_INCR)
            },
            {
                name: CHART_LABELS.RATE_POPLT_INCR,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.TOTAL_PPLT_GROWTH)
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