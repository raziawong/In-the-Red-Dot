function getYearSeriesChartData(years, data, key) {
    let series = years.map(y => {
        return data[y][key] ? data[y][key] : null;
    });
    return series;
}

function renderOverviewChart(type, title, seriesArray, otherOptObj, elementId) {
    let options = {
        chart: {
            type: type
        },
        title: {
            text: title
        },
        series: seriesArray
    }

    if (otherOptObj) {
        for (let opt in otherOptObj) {
            options[opt] = otherOptObj[opt];
        }
    }

    new ApexCharts(document.getElementById(elementId), options).render();
}

function renderComparisonChart(type, isStack, title, seriesArray, labelArray, elementId) {
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

function renderGroupedSparkLines(id, name, labels, seriesData) {
    let options = {
        chart: {
            id: id,
            group: 'residency',
            type: CHART_TYPES.AREA,
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
        }
    };

    new ApexCharts(document.getElementById(id), options).render();
}

function doPopulationTrendData(years, yearData) {
    renderComparisonChart(
        CHART_TYPES.BAR,
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

    renderComparisonChart(
        CHART_TYPES.BAR,
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

    renderComparisonChart(
        CHART_TYPES.BAR,
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

    renderComparisonChart(
        CHART_TYPES.LINE,
        false,
        'Age Dependency Ratio Insights', [{
                name: CHART_LABELS.AGE_DEP_15_64,
                type: CHART_TYPES.COLUMN,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.AGE_DEP_15_64)
            },
            {
                name: CHART_LABELS.AGE_DEP_20_64,
                type: CHART_TYPES.COLUMN,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.AGE_DEP_20_64)
            },
            {
                name: CHART_LABELS.CHILD_DEP_15_64,
                type: CHART_TYPES.AREA,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.CHILD_DEP_15_64)
            },
            {
                name: CHART_LABELS.CHILD_DEP_20_64,
                type: CHART_TYPES.AREA,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.CHILD_DEP_20_64)
            },
            {
                name: CHART_LABELS.OLD_DEP_15_64,
                type: CHART_TYPES.LINE,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.OLD_DEP_15_64)
            },
            {
                name: CHART_LABELS.OLD_DEP_20_64,
                type: CHART_TYPES.LINE,
                data: getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.OLD_DEP_20_64)
            }
        ],
        years,
        'dependency-trend'
    );

    renderGroupedSparkLines(
        'citizen-trend',
        CHART_LABELS.CITIZEN,
        years,
        getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.CITIZEN_PPLT)
    );

    renderGroupedSparkLines(
        'pr-trend',
        CHART_LABELS.PR,
        years,
        getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.PR_PPLT)
    );

    renderGroupedSparkLines(
        'nonres-trend',
        CHART_LABELS.NON_RES,
        years,
        getYearSeriesChartData(years, yearData, DOS_DATA_KEYS.NON_RES_PPLT)
    );

    renderComparisonChart(
        CHART_TYPES.AREA,
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
}

function doAllAnnualPopulationCharts(populationData) {
    let years = populationData.ascYear.slice(-10);
    let yearData = populationData.dataByYear;
    let latestData = yearData[years[years.length - 1]];

    // let options = {
    //     chart: {
    //         type: type
    //     },
    //     title: {
    //         text: title
    //     },
    //     series: [latestData[DOS_DATA_KEYS.CITIZEN_PPLT], latestData[DOS_DATA_KEYS.PR_PPLT], latestData[DOS_DATA_KEYS.NON_RES_PPLT]]
    // }

    let resPercentageArr = [latestData[DOS_DATA_KEYS.CITIZEN_PPLT], latestData[DOS_DATA_KEYS.PR_PPLT], latestData[DOS_DATA_KEYS.NON_RES_PPLT]].map(e => Math.ceil((e / latestData[DOS_DATA_KEYS.TOTAL_PPLT]) * 100));
    renderOverviewChart(
        CHART_TYPES.RADIAL_BAR,
        'Residency',
        resPercentageArr, {
            labels: [CHART_LABELS.CITIZEN, CHART_LABELS.PR, CHART_LABELS.NON_RES]
        },
        'residency-single'
    );

    renderOverviewChart(
        CHART_TYPES.PIE,
        'Gender', [
            latestData[DOS_DATA_KEYS.TOTAL_MALE], latestData[DOS_DATA_KEYS.TOTAL_FEMALE]
        ], {
            labels: [CHART_LABELS.MALE, CHART_LABELS.FEMALE]
        },
        'gender-single'
    );

    let ethPercentageArr = [
        latestData[DOS_DATA_KEYS.TOTAL_CHINESE], latestData[DOS_DATA_KEYS.TOTAL_MALAYS], latestData[DOS_DATA_KEYS.TOTAL_INDIANS], latestData[DOS_DATA_KEYS.TOTAL_OTHER_ETHN]
    ].map(e => (e / latestData[DOS_DATA_KEYS.TOTAL_PPLT]) * 100);
    renderOverviewChart(
        CHART_TYPES.PIE,
        'Ethnicity', [
            latestData[DOS_DATA_KEYS.TOTAL_CHINESE], latestData[DOS_DATA_KEYS.TOTAL_MALAYS], latestData[DOS_DATA_KEYS.TOTAL_INDIANS], latestData[DOS_DATA_KEYS.TOTAL_OTHER_ETHN]
        ], {
            labels: [CHART_LABELS.CHINESE, CHART_LABELS.MALAYS, CHART_LABELS.INDIANS, CHART_LABELS.OTHERS],
        },
        'race-single'
    );

    doPopulationTrendData(years, yearData, latestData);


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