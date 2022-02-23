function getYearSeriesChartData(years, data, key) {
    let series = years.map(y => {
        return data[y][key] ? data[y][key] : null;
    });
    return series;
}

function createApexChart(id, type, title, otherOptObj) {
    let options = {
        chart: {
            id: id,
            type: type
        },
        title: {
            text: title
        },
        series: []
    }

    if (otherOptObj) {
        for (let opt in otherOptObj) {
            options[opt] = otherOptObj[opt];
        }
    }

    let chart = new ApexCharts(document.getElementById(id), options);
    chart.render();

    return chart;
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

function getOverviewCharts() {
    let overviewCharts = {};

    overviewCharts[CHART_IDS.RESIDENCY_SINGLE] = createApexChart(
        CHART_IDS.RESIDENCY_SINGLE, CHART_TYPES.RADIAL_BAR,
        'Residency', { labels: [CHART_LABELS.CITIZEN, CHART_LABELS.PR, CHART_LABELS.NON_RES] }
    );

    overviewCharts[CHART_IDS.GENDER_SINGLE] = createApexChart(
        CHART_IDS.GENDER_SINGLE, CHART_TYPES.PIE,
        'Gender', { labels: [CHART_LABELS.MALE, CHART_LABELS.FEMALE] }
    );

    overviewCharts[CHART_IDS.RACE_SINGLE] = createApexChart(
        CHART_IDS.RACE_SINGLE, CHART_TYPES.PIE,
        'Ethnicity', { labels: [CHART_LABELS.CHINESE, CHART_LABELS.MALAYS, CHART_LABELS.INDIANS, CHART_LABELS.OTHERS] }
    );

    return overviewCharts;
}

function updateOverviewCharts(charts, latestData) {
    let resPercentageArr = [latestData[DOS_DATA_KEYS.CITIZEN_PPLT], latestData[DOS_DATA_KEYS.PR_PPLT], latestData[DOS_DATA_KEYS.NON_RES_PPLT]].map(e => Math.ceil((e / latestData[DOS_DATA_KEYS.TOTAL_PPLT]) * 100));

    console.log(charts);

    charts[CHART_IDS.RESIDENCY_SINGLE].updateSeries(resPercentageArr, true);
    charts[CHART_IDS.GENDER_SINGLE].updateSeries([latestData[DOS_DATA_KEYS.TOTAL_MALE], latestData[DOS_DATA_KEYS.TOTAL_FEMALE]], true);
    charts[CHART_IDS.RACE_SINGLE].updateSeries([latestData[DOS_DATA_KEYS.TOTAL_CHINESE], latestData[DOS_DATA_KEYS.TOTAL_MALAYS], latestData[DOS_DATA_KEYS.TOTAL_INDIANS], latestData[DOS_DATA_KEYS.TOTAL_OTHER_ETHN]], true);
}

function doPopulationOverview(years, yearData) {
    let totalPopulationEle = document.getElementById('total-population');
    let yearSelectEle = document.getElementById('total-population').getElementsByTagName('select')[0];
    for (let y of years.sort(UTIL.compareDesc)) {
        let optEle = document.createElement('option');
        optEle.value = y;
        optEle.innerText = y;
        yearSelectEle.appendChild(optEle);
    }

    let populationPlaceholder = totalPopulationEle.getElementsByTagName('span')[0];
    let latestYearOptEle = yearSelectEle.getElementsByTagName('option')[0];
    let chartObj = getOverviewCharts();

    latestYearOptEle.selected = true;
    updateOverviewCharts(chartObj, yearData[latestYearOptEle.value]);
    populationPlaceholder.innerText = yearData[latestYearOptEle.value][DOS_DATA_KEYS.TOTAL_PPLT];

    yearSelectEle.addEventListener('change', event => {
        let selectedYear = event.target.value || 0;
        if (selectedYear) {
            updateOverviewCharts(chartObj, yearData[selectedYear]);
            populationPlaceholder.innerText = yearData[selectedYear][DOS_DATA_KEYS.TOTAL_PPLT];
        }
    });
}