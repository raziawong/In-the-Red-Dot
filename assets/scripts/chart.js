function renderApexChart(id, type, title, isStack, otherOptObj) {
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
        options = {...options, ...otherOptObj };
    }

    let chart = new ApexCharts(document.getElementById(id), options);
    chart.render();

    return chart;
}

function renderSyncApexChart(id, chartOpt, title) {
    let options = {
        chart: chartOpt,
        title: {
            text: title
        },
        series: []
    };

    let chart = new ApexCharts(document.getElementById(id), options);
    chart.render();

    return chart;
}

function doPopulationOverview(_years, _dataByYear) {
    function initOverviewCharts() {
        let overviewCharts = {};

        overviewCharts[ELEMENT_IDS.RESIDENCY] = renderApexChart(
            ELEMENT_IDS.RESIDENCY, CHART_TYPES.PIE,
            CHART_TITLES.RESIDENCY, false, {
                labels: [CHART_LABELS.CITIZEN, CHART_LABELS.PR, CHART_LABELS.NON_RES]
            }
        );

        overviewCharts[ELEMENT_IDS.RACE] = renderApexChart(
            ELEMENT_IDS.RACE, CHART_TYPES.PIE,
            CHART_TITLES.ETHNICITY, false, {
                labels: [CHART_LABELS.CHINESE, CHART_LABELS.MALAYS, CHART_LABELS.INDIANS, CHART_LABELS.OTHERS]
            }
        );

        overviewCharts[ELEMENT_IDS.GENDER] = renderApexChart(
            ELEMENT_IDS.GENDER, CHART_TYPES.RADIAL_BAR,
            CHART_TITLES.GENDER, false, {
                labels: [CHART_LABELS.MALE, CHART_LABELS.FEMALE]
            }
        );

        overviewCharts[ELEMENT_IDS.MED_AGE] = renderApexChart(
            ELEMENT_IDS.MED_AGE, CHART_TYPES.RADIAL_BAR,
            CHART_TITLES.MEDIAN_AGE, false, {
                labels: [CHART_LABELS.CITIZEN, CHART_LABELS.RESIDENT],
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            value: {
                                formatter: (val) => val
                            }
                        }
                    }
                },
            }
        );

        overviewCharts[ELEMENT_IDS.AGE_GROUP] = renderApexChart(
            ELEMENT_IDS.AGE_GROUP, CHART_TYPES.BAR,
            CHART_TITLES.AGE_GROUP, true, {
                plotOptions: {
                    bar: {
                        horizontal: true
                    },
                },
                xaxis: { labels: { show: false } },
                yaxis: {
                    axisBorder: { show: true },
                    labels: { show: true }
                }
            }
        );

        return overviewCharts;
    }

    function initYearSelect() {
        function updateOverviewElements(annualData) {
            document.getElementById(ELEMENT_IDS.POPULATION).querySelector('span').innerText = annualData[AP_DATA_KEYS.TOTAL_PPLT];
        }

        let yearSelectEle = document.getElementById(ELEMENT_IDS.OVERVIEW_SEL_YEAR);
        let descYear = [..._years].sort(UTIL.compareAlphaNumDesc);
        for (let year of descYear) {
            let optEle = document.createElement('option');
            optEle.value = year;
            optEle.innerText = year;
            yearSelectEle.appendChild(optEle);
        }

        updateOverviewElements(_dataByYear[yearSelectEle.value]);

        yearSelectEle.addEventListener('change', evt => {
            let selectedYear = evt.target.value || 0;
            if (selectedYear) {
                updateOverviewCharts(_dataByYear[selectedYear]);
                updateOverviewElements(_dataByYear[selectedYear]);
            }
        });

        return yearSelectEle.value;
    }

    function updateOverviewCharts(annualData) {
        let totalCount = annualData[AP_DATA_KEYS.TOTAL_PPLT];
        let genderPrctArr = [annualData[AP_DATA_KEYS.TOTAL_MALE], annualData[AP_DATA_KEYS.TOTAL_FEMALE]].map(v => Math.round((v / totalCount) * 100));

        let ageGroup = Object.keys(annualData[AP_DATA_KEYS.TOTAL_FEMALE_AGE]).filter(k => !k.includes('over'));
        let ageGroupOpt = {
            dataLabels: {
                formatter: (val, opts) => {
                    return Math.round((Math.abs(val) / totalCount) * 100) + '%';
                }
            },
            series: [{
                name: CHART_LABELS.MALE,
                data: ageGroup.map(k => annualData[AP_DATA_KEYS.TOTAL_MALE_AGE][k])
            }, {
                name: CHART_LABELS.FEMALE,
                data: ageGroup.map(k => -annualData[AP_DATA_KEYS.TOTAL_FEMALE_AGE][k])
            }],
            tooltip: {
                shared: false,
                x: { formatter: v => v },
                y: { formatter: v => Math.abs(v) }
            },
            xaxis: {
                categories: ageGroup.map(label => label.replaceAll('_', ' ').replaceAll('years', '')).sort(UTIL.compareAlphaNumDesc),
            }
        };

        _oCharts[ELEMENT_IDS.GENDER].updateSeries(genderPrctArr);
        _oCharts[ELEMENT_IDS.MED_AGE].updateSeries([
            annualData[AP_DATA_KEYS.MED_AGE_CITIZEN],
            annualData[AP_DATA_KEYS.MED_AGE_RESIDENT]
        ]);
        _oCharts[ELEMENT_IDS.RESIDENCY].updateSeries([
            annualData[AP_DATA_KEYS.CITIZEN_PPLT],
            annualData[AP_DATA_KEYS.PR_PPLT],
            annualData[AP_DATA_KEYS.NON_RES_PPLT]
        ]);
        _oCharts[ELEMENT_IDS.RACE].updateSeries([
            annualData[AP_DATA_KEYS.TOTAL_CHINESE],
            annualData[AP_DATA_KEYS.TOTAL_MALAYS],
            annualData[AP_DATA_KEYS.TOTAL_INDIANS],
            annualData[AP_DATA_KEYS.TOTAL_OTHER_ETHN]
        ]);
        _oCharts[ELEMENT_IDS.AGE_GROUP].updateOptions(ageGroupOpt);
    }

    let _oCharts = initOverviewCharts();
    let initYear = initYearSelect();
    updateOverviewCharts(_dataByYear[initYear]);
}

function doPopulationTrend(_years, _yearData) {
    function initTrendCharts() {
        let trendCharts = {};

        trendCharts[ELEMENT_IDS.TREND_CITIZEN] = renderSyncApexChart(
            ELEMENT_IDS.TREND_CITIZEN, {
                id: ELEMENT_IDS.TREND_CITIZEN,
                group: 'residency',
                sparkline: { enabled: true },
                type: CHART_TYPES.AREA
            },
            CHART_LABELS.CITIZEN
        );

        trendCharts[ELEMENT_IDS.TREND_PR] = renderSyncApexChart(
            ELEMENT_IDS.TREND_PR, {
                id: ELEMENT_IDS.TREND_PR,
                group: 'residency',
                sparkline: { enabled: true },
                type: CHART_TYPES.AREA
            },
            CHART_LABELS.PR
        );

        trendCharts[ELEMENT_IDS.TREND_NONRES] = renderSyncApexChart(
            ELEMENT_IDS.TREND_NONRES, {
                id: ELEMENT_IDS.TREND_NONRES,
                group: 'residency',
                sparkline: { enabled: true },
                type: CHART_TYPES.AREA
            },
            CHART_LABELS.NON_RES
        );

        trendCharts[ELEMENT_IDS.TREND_POPINCR] = renderApexChart(
            ELEMENT_IDS.TREND_POPINCR, CHART_TYPES.AREA,
            CHART_TITLES.POP_GROWTH, false, {
                subtitle: { text: CHART_TITLES.POP_GROWTH_SUB },
                xaxis: { labels: { show: false } },
                yaxis: { labels: { show: false } }
            }
        );

        trendCharts[ELEMENT_IDS.TREND_MEDAGE_RES] = renderSyncApexChart(
            ELEMENT_IDS.TREND_MEDAGE_RES, {
                id: ELEMENT_IDS.TREND_MEDAGE_RES,
                group: 'medage',
                sparkline: { enabled: true },
                type: CHART_TYPES.AREA
            },
            `${CHART_LABELS.MEDIAN_AGE} (${CHART_LABELS.CITIZEN})`
        );

        trendCharts[ELEMENT_IDS.TREND_MEDAGE_CITIZEN] = renderSyncApexChart(
            ELEMENT_IDS.TREND_MEDAGE_CITIZEN, {
                id: ELEMENT_IDS.TREND_MEDAGE_CITIZEN,
                group: 'medage',
                sparkline: { enabled: true },
                type: CHART_TYPES.AREA
            },
            `${CHART_LABELS.MEDIAN_AGE} (${CHART_LABELS.RESIDENT})`
        );

        trendCharts[ELEMENT_IDS.TREND_DEPENDENCY] = renderApexChart(
            ELEMENT_IDS.TREND_DEPENDENCY, CHART_TYPES.LINE,
            CHART_TITLES.AGE_DEPENDENCY_RATIO, false, {
                xaxis: { labels: { show: false } },
                yaxis: { labels: { show: false } }
            }
        );

        return trendCharts;
    }

    function initTrendSelect() {
        let yearGroupEle = document.getElementById(ELEMENT_IDS.TREND_SEL);
        let yearStartEle = document.getElementById(ELEMENT_IDS.TREND_SEL_FROM);
        let yearEndEle = document.getElementById(ELEMENT_IDS.TREND_SEL_TO);
        let rangeErrorEle = yearGroupEle.querySelector('span');

        for (let year of _years) {
            let optEle = document.createElement('option');
            optEle.value = year;
            optEle.innerText = year;
            yearStartEle.appendChild(optEle);
            yearEndEle.prepend(optEle.cloneNode(true));
        }

        let yearStartEmpty = document.createElement('option');
        let yearEndEmpty = document.createElement('option');
        yearStartEmpty.setAttribute('value', '');
        yearStartEmpty.innerText = 'From';
        yearEndEmpty.setAttribute('value', '');
        yearEndEmpty.innerText = 'To';

        yearEndEle.insertBefore(yearEndEmpty, yearEndEle.childNodes[0]);
        yearStartEle.insertBefore(yearStartEmpty, yearStartEle.childNodes[0]);
        yearEndEle.value = _years[_years.length - 1];
        yearStartEle.value = yearEndEle.value - 10;

        yearGroupEle.addEventListener('change', evt => {
            rangeErrorEle.style.display = 'none';
            yearStartEle.classList.remove('input-error');
            yearEndEle.classList.remove('input-error');

            let diff = yearEndEle.value - yearStartEle.value;
            if (diff <= 0 || diff < 1 || diff > 10) {
                yearStartEle.classList.add('input-error');
                yearEndEle.classList.add('input-error');
                rangeErrorEle.style.display = 'initial';
                rangeErrorEle.innerText =
                    diff > 10 ? ERROR_MSG.YEAR_10 :
                    diff <= 0 ? ERROR_MSG.YEAR_NEG :
                    ERROR_MSG.YEAR_2;
            } else {
                let newRange = _years.slice(_years.indexOf(yearStartEle.value), _years.indexOf(yearEndEle.value) + 1);
                lastPopIncrBarCount = 0;
                updateTrendCharts(newRange);
            }
        });

        return [yearStartEle.value, yearEndEle.value]
    }

    function getYearSeriesChartData(years, key) {
        let series = years.map(y => {
            return _yearData[y][key] ? _yearData[y][key] : null;
        });
        return series;
    }

    function updateTrendCharts(yearRange) {
        function togglePopulationGrowth() {
            let enabledOnSeries = [];
            let series = [];
            let yaxis = [];

            if (lastPopIncrBarCount == 1) {
                // if previously was population data, update to gender data
                series = [{
                    name: CHART_LABELS.MALE,
                    data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.TOTAL_MALE),
                    type: CHART_TYPES.COLUMN
                }, {
                    name: CHART_LABELS.FEMALE,
                    data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.TOTAL_FEMALE),
                    type: CHART_TYPES.COLUMN
                }];
                yaxis = [{
                    labels: { show: false },
                    seriesName: CHART_LABELS.MALE
                }, {
                    labels: { show: false },
                    seriesName: CHART_LABELS.FEMALE
                }];
            } else if (lastPopIncrBarCount == 2) {
                // if previously was gender data, update to ethnicity data
                series = [{
                    name: CHART_LABELS.CHINESE,
                    data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.TOTAL_CHINESE),
                    type: CHART_TYPES.COLUMN
                }, {
                    name: CHART_LABELS.MALAYS,
                    data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.TOTAL_MALAYS),
                    type: CHART_TYPES.COLUMN
                }, {
                    name: CHART_LABELS.INDIANS,
                    data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.TOTAL_INDIANS),
                    type: CHART_TYPES.COLUMN
                }, {
                    name: CHART_LABELS.OTHERS,
                    data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.TOTAL_OTHER_ETHN),
                    type: CHART_TYPES.COLUMN
                }];
                yaxis = [{
                    labels: { show: false },
                    seriesName: CHART_LABELS.CHINESE
                }, {
                    labels: { show: false },
                    seriesName: CHART_LABELS.MALAYS
                }, {
                    labels: { show: false },
                    seriesName: CHART_LABELS.INDIANS
                }, {
                    labels: { show: false },
                    seriesName: CHART_LABELS.OTHERS
                }];
            } else {
                // default update to population data
                series = [{
                    name: CHART_LABELS.POPULATION,
                    data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.TOTAL_PPLT),
                    type: CHART_TYPES.COLUMN
                }];
                yaxis = [{
                    labels: { show: false },
                    seriesName: CHART_LABELS.POPULATION
                }];
                lastPopIncrBarCount = 1;
            }

            series.push({
                name: CHART_LABELS.RATE_NATURAL_INCR,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.RATE_NATURAL_INCR),
                type: CHART_TYPES.LINE
            }, {
                name: CHART_LABELS.RATE_POPLT_INCR,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.TOTAL_PPLT_GROWTH),
                type: CHART_TYPES.LINE
            });
            yaxis.push({
                labels: { show: false },
                opposite: true,
                seriesName: CHART_LABELS.RATE_NATURAL_INCR
            }, {
                labels: { show: false },
                opposite: true,
                seriesName: CHART_LABELS.RATE_POPLT_INCR
            });
            enabledOnSeries = [series.length - 2, series.length - 1];

            _tCharts[ELEMENT_IDS.TREND_POPINCR].updateOptions({
                dataLabels: {
                    enabledOnSeries
                },
                labels: yearRange,
                series,
                yaxis
            }, true, true);

        }

        _tCharts[ELEMENT_IDS.TREND_CITIZEN].updateOptions({
            labels: yearRange,
            colors: [CHART_CONF.COLOR_RANGE[0]],
            series: [{
                name: CHART_LABELS.CITIZEN,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.CITIZEN_PPLT)
            }]
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_PR].updateOptions({
            labels: yearRange,
            colors: [CHART_CONF.COLOR_RANGE[1]],
            series: [{
                name: CHART_LABELS.PR,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.PR_PPLT)
            }]
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_NONRES].updateOptions({
            labels: yearRange,
            colors: [CHART_CONF.COLOR_RANGE[2]],
            series: [{
                name: CHART_LABELS.NON_RES,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.NON_RES_PPLT)
            }]
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_POPINCR].updateOptions({
            chart: {
                toolbar: {
                    tools: {
                        customIcons: [{
                            class: 'growth-toggle',
                            click: (tChart, opt, evt) => {
                                togglePopulationGrowth(yearRange);
                                lastPopIncrBarCount = opt.globals.comboBarCount;
                            },
                            icon: '<i class="fa-solid fa-chart-column"></i>',
                            index: 2,
                            title: 'Toggle Column Type'
                        }]
                    }
                }
            }
        });
        //console.log(document.querySelector('.growth-toggle'));
        togglePopulationGrowth(yearRange);

        _tCharts[ELEMENT_IDS.TREND_MEDAGE_RES].updateOptions({
            labels: yearRange,
            colors: [CHART_CONF.COLOR_RANGE[3]],
            series: [{
                name: CHART_LABELS.RESIDENT,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.MED_AGE_RESIDENT)
            }]
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_MEDAGE_CITIZEN].updateOptions({
            labels: yearRange,
            colors: [CHART_CONF.COLOR_RANGE[4]],
            series: [{
                name: CHART_LABELS.CITIZEN,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.MED_AGE_CITIZEN)
            }]
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_DEPENDENCY].updateOptions({
            dataLabels: {
                enabled: true,
                enabledOnSeries: [2, 3, 4, 5],
            },
            labels: yearRange,
            series: [{
                name: CHART_LABELS.AGE_DEP_15_64,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.AGE_DEP_15_64),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.AGE_DEP_20_64,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.AGE_DEP_20_64),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.CHILD_DEP_15_64,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.CHILD_DEP_15_64),
                type: CHART_TYPES.LINE,
            }, {
                name: CHART_LABELS.CHILD_DEP_20_64,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.CHILD_DEP_20_64),
                type: CHART_TYPES.LINE
            }, {
                name: CHART_LABELS.OLD_DEP_15_64,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.OLD_DEP_15_64),
                type: CHART_TYPES.LINE
            }, {
                name: CHART_LABELS.OLD_DEP_20_64,
                data: getYearSeriesChartData(yearRange, AP_DATA_KEYS.OLD_DEP_20_64),
                type: CHART_TYPES.LINE
            }],
            yaxis: [{
                labels: { show: false },
                seriesName: CHART_LABELS.AGE_DEP_15_64
            }, {
                labels: { show: false },
                seriesName: CHART_LABELS.AGE_DEP_20_64
            }, {
                labels: { show: false },
                opposite: true,
                seriesName: CHART_LABELS.CHILD_DEP_15_64
            }, {
                labels: { show: false },
                opposite: true,
                seriesName: CHART_LABELS.CHILD_DEP_20_64
            }, {
                labels: { show: false },
                seriesName: CHART_LABELS.OLD_DEP_15_64
            }, {
                labels: { show: false },
                opposite: true,
                seriesName: CHART_LABELS.OLD_DEP_20_64
            }]
        });
    }

    let lastPopIncrBarCount = 0;
    let _tCharts = initTrendCharts();
    let initYears = initTrendSelect();
    updateTrendCharts(_years.slice(_years.indexOf(initYears[0]), _years.indexOf(initYears[1]) + 1));
}

function getGeoDistrCharts() {
    let geoCharts = {};

    geoCharts[ELEMENT_IDS.GEO_AGE_GROUP] = renderApexChart(
        ELEMENT_IDS.GEO_AGE_GROUP, CHART_TYPES.BAR,
        CHART_TITLES.AGE_GROUP, false, {
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

    geoCharts[ELEMENT_IDS.GEO_AGE_GENDER] = renderApexChart(
        ELEMENT_IDS.GEO_AGE_GENDER, CHART_TYPES.RADIAL_BAR,
        CHART_TITLES.AGE_GROUP + ' ' + CHART_TITLES.GENDER, false, {
            labels: [CHART_LABELS.MALE, CHART_LABELS.FEMALE]
        });

    geoCharts[ELEMENT_IDS.GEO_RACE] = renderApexChart(
        ELEMENT_IDS.GEO_RACE, CHART_TYPES.PIE,
        CHART_TITLES.ETHNICITY, false, {
            labels: [CHART_LABELS.CHINESE, CHART_LABELS.MALAYS, CHART_LABELS.INDIANS, CHART_LABELS.OTHERS]
        }
    );

    geoCharts[ELEMENT_IDS.GEO_DWELLING] = renderApexChart(
        ELEMENT_IDS.GEO_DWELLING, CHART_TYPES.TREE_MAP,
        CHART_TITLES.DWELLING_TYPE, false, { dataLabels: { show: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_TENANCY] = renderApexChart(
        ELEMENT_IDS.GEO_TENANCY, CHART_TYPES.PIE,
        CHART_TITLES.TENANCY_TYPE, false, { dataLabels: { show: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_EDUCATION] = renderApexChart(
        ELEMENT_IDS.GEO_EDUCATION, CHART_TYPES.RADAR,
        CHART_TITLES.QUALIFICATION, false, { dataLabels: { show: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_LITERACY] = renderApexChart(
        ELEMENT_IDS.GEO_LITERACY, CHART_TYPES.RADIAL_BAR,
        CHART_TITLES.LITERACY, false, {
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        total: {
                            show: true,
                            label: CHART_LABELS.TOTAL
                        }
                    }
                }
            }
        }
    );

    geoCharts[ELEMENT_IDS.GEO_OCCUPATION] = renderApexChart(
        ELEMENT_IDS.GEO_OCCUPATION, CHART_TYPES.BAR,
        CHART_TITLES.OCCUPATION, false, {
            dataLabels: { show: true },
            yaxis: { labels: { show: false } }
        }
    );

    geoCharts[ELEMENT_IDS.GEO_INCOME] = renderApexChart(
        ELEMENT_IDS.GEO_INCOME, CHART_TYPES.LINE,
        CHART_TITLES.INCOME, false, {
            dataLabels: { show: true },
            yaxis: { labels: { show: false } }
        }
    );

    geoCharts[ELEMENT_IDS.GEO_TRANSPORT] = renderApexChart(
        ELEMENT_IDS.GEO_TRANSPORT, CHART_TYPES.BAR,
        CHART_TITLES.TRANSPORT, false, {
            plotOptions: {
                bar: {
                    horizontal: true
                }
            },
            xaxis: { labels: { show: false } }
        }
    );

    geoCharts[ELEMENT_IDS.GEO_TRAVEL] = renderApexChart(
        ELEMENT_IDS.GEO_TRAVEL, CHART_TYPES.POLAR_AREA,
        CHART_TITLES.TRAVEL_TIME, false, { dataLabels: { show: true } }
    );

    return geoCharts;
}

function updateGeoDistrCharts(charts, mLayerProp) {
    let ageGroupData = mLayerProp.ageGroup;
    let raceData = mLayerProp.ethnicGroup;
    let dwellData = mLayerProp.dwellingType;
    let tenantData = mLayerProp.tenancyType;
    let eduData = mLayerProp.qualification;
    let litData = mLayerProp.literacy;
    let occupationData = mLayerProp.occupation;
    let incomeData = mLayerProp.grossIncome;
    let transportData = mLayerProp.transportMode;
    let travelTimeData = mLayerProp.travelTime;

    let {
        [GD_DATA_KEYS.TOTAL]: agTotal, [GD_DATA_KEYS.FEMALES]: agFemale, [GD_DATA_KEYS.MALES]: agMale
    } = ageGroupData;
    let ageGroupLabels = Object.keys(agTotal).filter(k => !k.includes(GD_DATA_KEYS.TOTAL)).sort(UTIL.compareAlphaNumDesc);
    let ageGroupOpt = {
        chart: {
            events: {
                dataPointSelection: (evt, mChart, op) => {
                    let agEle = document.getElementById(ELEMENT_IDS.GEO_AGE_GROUP);
                    let genderEle = document.getElementById(ELEMENT_IDS.GEO_AGE_GENDER);
                    let selDataPoints = op.selectedDataPoints;

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
        xaxis: {
            categories: ageGroupLabels
        }
    };
    let ageGroupSeries = ageGroupData ? {
        series: [{
            data: ageGroupLabels.map(k => agTotal[k])
        }]
    } : {
        series: [],
        noData: CHART_CONF.NO_DATA_OPT
    };
    ageGroupOpt = {...ageGroupOpt, ...ageGroupSeries };

    let dwellOpt = {
        dataLabels: {
            formatter: (text, op) => {
                let label = text == GD_DATA_KEYS.HDB_DWELL ? CHART_LABELS.HDB :
                    text == GD_DATA_KEYS.CONDO_OTH ? CHART_LABELS.CONDO :
                    text == GD_DATA_KEYS.LANDED_PROP ? CHART_LABELS.LANDED :
                    CHART_LABELS.OTHERS;
                let percentage = Math.round((op.value / dwellData[GD_DATA_KEYS.TOTAL]) * 100) + '%';
                return [label, percentage];
            }
        }
    };
    let dwellSeries = dwellData ? {
        series: [{
            data: Object.entries(dwellData).map(d => { return { x: d[0], y: d[1] } }).filter(d => (!d.x.includes('Total') && d.y))
        }]
    } : {
        series: [],
        noData: CHART_CONF.NO_DATA_OPT
    };
    dwellOpt = {...dwellOpt, ...dwellSeries };

    let tenantLabels = Object.keys(tenantData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    let tenantOpt = {
        series: tenantLabels.map(k => tenantData[k]),
        labels: tenantLabels
    };
    let tenantSeries = tenantData ? {
        series: [{
            data: Object.entries(dwellData).map(d => { return { x: d[0], y: d[1] } }).filter(d => (!d.x.includes('Total') && d.y))
        }]
    } : {
        series: [],
        noData: CHART_CONF.NO_DATA_OPT
    };

    let eduTypeLabels = Object.keys(eduData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    let educationOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: eduTypeLabels.map(k => eduData[k])
        }],
        xaxis: {
            categories: eduTypeLabels,
            labels: {
                formatter: (text) => {
                    return text == GD_DATA_KEYS.UNIVERSITY ? CHART_LABELS.UNIVERSITY :
                        text == GD_DATA_KEYS.PROFESSIONAL ? CHART_LABELS.PROFESSIONAL :
                        text == GD_DATA_KEYS.POLYTECHNIC ? CHART_LABELS.POLYTECHNIC :
                        text == GD_DATA_KEYS.POST_SEC ? CHART_LABELS.POST_SEC :
                        text == GD_DATA_KEYS.SECONDARY ? CHART_LABELS.SECONDARY :
                        text == GD_DATA_KEYS.LOW_SEC ? CHART_LABELS.LOW_SECONDARY :
                        text == GD_DATA_KEYS.PRIMARY ? CHART_LABELS.PRIMARY :
                        CHART_LABELS.NONE;
                }
            }
        }
    };

    let litLabels = Object.keys(litData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL) && !k.startsWith(GD_DATA_KEYS.LIT));
    let litSeries = litLabels.map(k => {
        let val = litData[k];
        val = Array.isArray(val) ?
            val.map(o => UTIL.convertToNumber(o.value)).reduce((p, a) => a += p) :
            val;
        val = Math.round((val / litData[GD_DATA_KEYS.TOTAL]) * 100);
        return val;
    });
    let litOpt = {
        labels: litLabels.map(k => {
            return k == GD_DATA_KEYS.ONE_LANG ? CHART_LABELS.LIT_ONE :
                k == GD_DATA_KEYS.TWO_LANG ? CHART_LABELS.LIT_TWO :
                k == GD_DATA_KEYS.THREE_LANG ? CHART_LABELS.LIT_THREE :
                k;
        }),
        plotOptions: {
            radialBar: {
                dataLabels: {
                    total: {
                        formatter: (w) => litData[GD_DATA_KEYS.TOTAL]
                    }
                }
            }
        },
        series: litSeries
    };

    let occupationLabels = Object.keys(occupationData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    let occupationOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: occupationLabels.map(k => occupationData[k])
        }],
        xaxis: {
            categories: occupationLabels.map(k => k.replace('1/', ''))
        }
    };

    let incomeLabels = Object.keys(incomeData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    let incomeOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: incomeLabels.map(k => incomeData[k])
        }],
        xaxis: {
            categories: incomeLabels
        }
    };

    let transportLabels = Object.keys(transportData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    let transportOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: transportLabels.map(k => transportData[k])
        }],
        dataLabels: {
            enable: true,
            formatter: (val, op) => Math.round(val / transportData[GD_DATA_KEYS.TOTAL] * 100) + '%'
        },
        xaxis: {
            categories: transportLabels.map(k => k.replace('1/', '')),
        },
        yaxis: {
            labels: {
                formatter: (text) => {
                    return text == GD_DATA_KEYS.CAR ? CHART_LABELS.CAR :
                        text == GD_DATA_KEYS.LORRY_PICKUP ? CHART_LABELS.LORRY :
                        text == GD_DATA_KEYS.MRT_LRT_BUS ? CHART_LABELS.TRAIN_BUS :
                        text == GD_DATA_KEYS.MRT_LRT ? CHART_LABELS.TRAIN :
                        text == GD_DATA_KEYS.MOTORCYCLE_SCOOTER ? CHART_LABELS.MOTORCYCLE :
                        text == GD_DATA_KEYS.OTHER_MRT_LRT_BUS ? CHART_LABELS.TRAIN_BUS_OTHERS :
                        text == GD_DATA_KEYS.PRIVATE_BUS_VAN ? CHART_LABELS.PRIVATE_BUS :
                        text == GD_DATA_KEYS.PUBLIC_BUS ? CHART_LABELS.PUBLIC_BUS :
                        text == GD_DATA_KEYS.PRIVATE_HIRE_CAR ? CHART_LABELS.PRIVATE_HIRE_CAR :
                        text;
                }
            }
        }
    };

    let travelLabels = Object.keys(travelTimeData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    let travelOpt = {
        labels: travelLabels,
        series: travelLabels.map(k => travelTimeData[k]),
    };

    charts[ELEMENT_IDS.GEO_AGE_GROUP].updateOptions(ageGroupOpt);
    charts[ELEMENT_IDS.GEO_RACE].updateSeries([
        raceData[GD_DATA_KEYS.CHINESE],
        raceData[GD_DATA_KEYS.MALAYS],
        raceData[GD_DATA_KEYS.INDIANS],
        raceData[GD_DATA_KEYS.OTHERS]
    ]);
    charts[ELEMENT_IDS.GEO_DWELLING].updateOptions(dwellOpt);
    charts[ELEMENT_IDS.GEO_TENANCY].updateOptions(tenantOpt);
    charts[ELEMENT_IDS.GEO_EDUCATION].updateOptions(educationOpt);
    charts[ELEMENT_IDS.GEO_LITERACY].updateOptions(litOpt);
    charts[ELEMENT_IDS.GEO_OCCUPATION].updateOptions(occupationOpt);
    charts[ELEMENT_IDS.GEO_INCOME].updateOptions(incomeOpt);
    charts[ELEMENT_IDS.GEO_TRANSPORT].updateOptions(transportOpt);
    charts[ELEMENT_IDS.GEO_TRAVEL].updateOptions(travelOpt);
}