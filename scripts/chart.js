function getYearSeriesChartData(years, data, key) {
    let series = years.map(y => {
        return data[y][key] ? data[y][key] : null;
    });
    return series;
}

function createApexChart(id, type, title, isStack, otherOptObj) {
    let options = {
        chart: {
            id: id,
            type: type,
            stacked: isStack
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

    // let options = {
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

    // let chart = new ApexCharts(document.getElementById("population-stack"), options);
    // chart.render();
}

function getOverviewCharts() {
    let overviewCharts = {};

    overviewCharts[ELEMENT_IDS.RESIDENCY] = createApexChart(
        ELEMENT_IDS.RESIDENCY, CHART_TYPES.PIE,
        'Residency', false, { labels: [CHART_LABELS.CITIZEN, CHART_LABELS.PR, CHART_LABELS.NON_RES] }
    );

    overviewCharts[ELEMENT_IDS.GENDER] = createApexChart(
        ELEMENT_IDS.GENDER, CHART_TYPES.RADIAL_BAR,
        'Gender', false, { labels: [CHART_LABELS.MALE, CHART_LABELS.FEMALE] }
    );

    overviewCharts[ELEMENT_IDS.RACE] = createApexChart(
        ELEMENT_IDS.RACE, CHART_TYPES.PIE,
        'Ethnicity', false, { labels: [CHART_LABELS.CHINESE, CHART_LABELS.MALAYS, CHART_LABELS.INDIANS, CHART_LABELS.OTHERS] }
    );

    overviewCharts[ELEMENT_IDS.AGE_GROUP] = createApexChart(
        ELEMENT_IDS.AGE_GROUP, CHART_TYPES.BAR,
        'Age Group', true, {
            plotOptions: {
                bar: {
                    horizontal: true
                },
            }
        }
    );

    return overviewCharts;
}

function updateOverviewCharts(charts, populationData) {
    let totalCount = populationData[DOS_DATA_KEYS.TOTAL_PPLT];
    let genderPrctArr = [populationData[DOS_DATA_KEYS.TOTAL_MALE], populationData[DOS_DATA_KEYS.TOTAL_FEMALE]].map(v => Math.round((v / totalCount) * 100));

    let ageGroup = Object.keys(populationData[DOS_DATA_KEYS.TOTAL_FEMALE_AGE]).filter(k => !k.includes('over'));
    let ageGroupOpt = {
        dataLabels: {
            formatter: (val, opts) => {
                return Math.round((Math.abs(val) / totalCount) * 100) + '%';
            }
        },
        series: [{
                name: CHART_LABELS.MALE,
                data: ageGroup.map(k => populationData[DOS_DATA_KEYS.TOTAL_MALE_AGE][k])
            },
            {
                name: CHART_LABELS.FEMALE,
                data: ageGroup.map(k => -populationData[DOS_DATA_KEYS.TOTAL_FEMALE_AGE][k])
            }
        ],
        tooltip: {
            shared: false,
            x: { formatter: v => v },
            y: { formatter: v => Math.abs(v) }
        },
        xaxis: {
            categories: ageGroup.map(label => label.replaceAll('_', ' ').replaceAll('years', '')).sort(UTIL.compareAlphaNumDesc),
        },
        yaxis: {
            axisBorder: { show: true },
            labels: { show: true }
        }
    };

    charts[ELEMENT_IDS.RESIDENCY].updateSeries([
        populationData[DOS_DATA_KEYS.CITIZEN_PPLT],
        populationData[DOS_DATA_KEYS.PR_PPLT],
        populationData[DOS_DATA_KEYS.NON_RES_PPLT]
    ]);
    charts[ELEMENT_IDS.GENDER].updateSeries(genderPrctArr);
    charts[ELEMENT_IDS.RACE].updateSeries([
        populationData[DOS_DATA_KEYS.TOTAL_CHINESE],
        populationData[DOS_DATA_KEYS.TOTAL_MALAYS],
        populationData[DOS_DATA_KEYS.TOTAL_INDIANS],
        populationData[DOS_DATA_KEYS.TOTAL_OTHER_ETHN]
    ]);
    charts[ELEMENT_IDS.AGE_GROUP].updateOptions(ageGroupOpt);
}

function updateOverviewElements(populationData) {
    document.getElementById(ELEMENT_IDS.POPULATION).getElementsByTagName('span')[0].innerText = populationData[DOS_DATA_KEYS.TOTAL_PPLT];
    document.getElementById(ELEMENT_IDS.MED_AGE_CITIZEN).getElementsByTagName('span')[0].innerText = populationData[DOS_DATA_KEYS.MED_AGE_CITIZEN];
    document.getElementById(ELEMENT_IDS.MED_AGE_RESIDENT).getElementsByTagName('span')[0].innerText = populationData[DOS_DATA_KEYS.MED_AGE_RESIDENT];
}

function doPopulationOverview(years, dataByYear) {
    let yearSelectEle = document.getElementById(ELEMENT_IDS.POPULATION).getElementsByTagName('select')[0];
    for (let year of years.sort(UTIL.compareDesc)) {
        let optEle = document.createElement('option');
        optEle.value = year;
        optEle.innerText = year;
        yearSelectEle.appendChild(optEle);
    }

    let chartObj = getOverviewCharts();
    updateOverviewCharts(chartObj, dataByYear[yearSelectEle.value]);
    updateOverviewElements(dataByYear[yearSelectEle.value]);

    yearSelectEle.addEventListener('change', event => {
        let selectedYear = event.target.value || 0;
        if (selectedYear) {
            updateOverviewCharts(chartObj, dataByYear[selectedYear]);
            updateOverviewElements(dataByYear[selectedYear]);
        }
    });
}

function getGeoDistrCharts() {
    let geoCharts = {};

    geoCharts[ELEMENT_IDS.GEO_AGE_GROUP] = createApexChart(
        ELEMENT_IDS.GEO_AGE_GROUP, CHART_TYPES.BAR,
        'Age Group', false, {
            plotOptions: {
                bar: {
                    horizontal: true
                }
            },
            subtitle: {
                text: 'Click bar to see gender breakdown'
            },
            xaxis: {
                labels: {
                    show: false
                }
            }
        }
    );

    geoCharts[ELEMENT_IDS.GEO_AGE_GENDER] = createApexChart(
        ELEMENT_IDS.GEO_AGE_GENDER, CHART_TYPES.RADIAL_BAR,
        'Age Group Gender', false, {
            labels: [CHART_LABELS.MALE, CHART_LABELS.FEMALE]
        });

    geoCharts[ELEMENT_IDS.GEO_RACE] = createApexChart(
        ELEMENT_IDS.GEO_RACE, CHART_TYPES.PIE,
        'Ethnicity', false, {
            labels: [CHART_LABELS.CHINESE, CHART_LABELS.MALAYS, CHART_LABELS.INDIANS, CHART_LABELS.OTHERS]
        }
    );

    geoCharts[ELEMENT_IDS.GEO_DWELLING] = createApexChart(
        ELEMENT_IDS.GEO_DWELLING, CHART_TYPES.TREE_MAP,
        'Dwelling Type', false, { dataLabels: { show: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_EDUCATION] = createApexChart(
        ELEMENT_IDS.GEO_EDUCATION, CHART_TYPES.RADAR,
        'Qualification', false, { dataLabels: { show: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_LITERACY] = createApexChart(
        ELEMENT_IDS.GEO_LITERACY, CHART_TYPES.RADAR,
        'Literacy', false, { dataLabels: { show: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_OCCUPATION] = createApexChart(
        ELEMENT_IDS.GEO_OCCUPATION, CHART_TYPES.BAR,
        'Occupation', false, { dataLabels: { show: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_INCOME] = createApexChart(
        ELEMENT_IDS.GEO_INCOME, CHART_TYPES.LINE,
        'Income', false, { dataLabels: { show: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_TRANSPORT] = createApexChart(
        ELEMENT_IDS.GEO_TRANSPORT, CHART_TYPES.LINE,
        'Transport', false, { dataLabels: { show: true } }
    );

    return geoCharts;
}

function updateGeoDistrCharts(charts, mLayerProp) {
    let ageGroupData = mLayerProp.ageGroup;
    let raceData = mLayerProp.ethnicGroup;
    let dwellData = mLayerProp.dwellingType;
    let eduData = mLayerProp.qualification;
    let litData = mLayerProp.literacy;
    let occupationData = mLayerProp.occupation;
    let incomeData = mLayerProp.grossIncome;
    let transportData = mLayerProp.transportMode;

    let {
        [MAP_LAYER_PROPS.TOTAL]: agTotal, [MAP_LAYER_PROPS.FEMALES]: agFemale, [MAP_LAYER_PROPS.MALES]: agMale
    } = ageGroupData;
    let ageGroupLabels = Object.keys(agTotal).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL)).sort(UTIL.compareAlphaNumDesc);
    let ageGroupOpt = {
        chart: {
            events: {
                dataPointSelection: function(evt, mChart, opt) {
                    let agEle = document.getElementById(ELEMENT_IDS.GEO_AGE_GROUP);
                    let genderEle = document.getElementById(ELEMENT_IDS.GEO_AGE_GENDER);
                    let selDataPoints = opt.selectedDataPoints;

                    if (selDataPoints[0].length === 1) {
                        let key = ageGroupLabels[selDataPoints[0]];
                        let genderPrctArr = [agMale[key], agFemale[key]].map(v => Math.round((v / agTotal[key]) * 100));
                        charts[ELEMENT_IDS.GEO_AGE_GENDER].updateOptions({
                            chart: {
                                width: '30%'
                            },
                            series: genderPrctArr
                        });

                        if (!genderEle.classList.contains("active")) {
                            mChart.updateOptions({
                                chart: {
                                    width: '70%'
                                }
                            });
                            agEle.classList.add("gender-activated");
                            genderEle.classList.add("active");
                        }
                    } else if (selDataPoints[0].length === 0) {
                        agEle.classList.remove("gender-activated")
                        genderEle.classList.remove("active");
                        mChart.updateOptions({
                            chart: {
                                width: '100%'
                            }
                        });
                    }
                }
            }
        },
        series: [{
            data: ageGroupLabels.map(k => agTotal.hasOwnProperty(k) ? agTotal[k] : null)
        }],
        xaxis: {
            categories: ageGroupLabels
        }
    };

    let dwellOpt = {
        series: [{
            data: Object.entries(dwellData).map(d => { return { x: d[0], y: d[1] } }).filter(d => (!d.x.includes('Total') && d.y))
        }],
        dataLabels: {
            formatter: function(text, op) {
                let label = text == MAP_LAYER_PROPS.HDB_DWELL ? CHART_LABELS.HDB :
                    text == MAP_LAYER_PROPS.CONDO_OTH ? CHART_LABELS.CONDO :
                    text == MAP_LAYER_PROPS.LANDED_PROP ? CHART_LABELS.LANDED :
                    CHART_LABELS.OTHERS;
                let percentage = Math.round((op.value / dwellData[MAP_LAYER_PROPS.TOTAL]) * 100) + '%';
                return [label, percentage];
            }
        }
    };

    let eduTypeLabels = Object.keys(eduData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let educationOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: eduTypeLabels.map(k => eduData.hasOwnProperty(k) ? eduData[k] : null)
        }],
        xaxis: {
            categories: eduTypeLabels,
            labels: {
                formatter: function(val, ts, op) {
                    return val == MAP_LAYER_PROPS.UNIVERSITY ? CHART_LABELS.UNIVERSITY :
                        val == MAP_LAYER_PROPS.PROFESSIONAL ? CHART_LABELS.PROFESSIONAL :
                        val == MAP_LAYER_PROPS.POLYTECHNIC ? CHART_LABELS.POLYTECHNIC :
                        val == MAP_LAYER_PROPS.POST_SEC ? CHART_LABELS.POST_SEC :
                        val == MAP_LAYER_PROPS.SECONDARY ? CHART_LABELS.SECONDARY :
                        val == MAP_LAYER_PROPS.LOW_SEC ? CHART_LABELS.LOW_SECONDARY :
                        val == MAP_LAYER_PROPS.PRIMARY ? CHART_LABELS.PRIMARY :
                        CHART_LABELS.NONE;
                }
            }
        }
    };

    let occupationLabels = Object.keys(occupationData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let occupationOpt = {
        series: [{
            name: 'Population',
            data: occupationLabels.map(k => occupationData.hasOwnProperty(k) ? occupationData[k] : null)
        }],
        xaxis: {
            categories: occupationLabels.map(k => k.replace('1/', ''))
        }
    };

    let incomeLabels = Object.keys(incomeData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let incomeOpt = {
        series: [{
            name: 'Population',
            data: incomeLabels.map(k => incomeData.hasOwnProperty(k) ? incomeData[k] : null)
        }],
        xaxis: {
            categories: incomeLabels
        }
    };

    charts[ELEMENT_IDS.GEO_AGE_GROUP].updateOptions(ageGroupOpt);
    charts[ELEMENT_IDS.GEO_RACE].updateSeries([
        raceData[MAP_LAYER_PROPS.CHINESE],
        raceData[MAP_LAYER_PROPS.MALAYS],
        raceData[MAP_LAYER_PROPS.INDIANS],
        raceData[MAP_LAYER_PROPS.OTHERS]
    ]);
    charts[ELEMENT_IDS.GEO_DWELLING].updateOptions(dwellOpt);
    charts[ELEMENT_IDS.GEO_EDUCATION].updateOptions(educationOpt);
    charts[ELEMENT_IDS.GEO_OCCUPATION].updateOptions(occupationOpt);
    charts[ELEMENT_IDS.GEO_INCOME].updateOptions(incomeOpt);
}