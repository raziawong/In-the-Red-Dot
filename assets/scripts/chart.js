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

        overviewCharts[ELEMENT_IDS.GENDER] = renderApexChart(
            ELEMENT_IDS.GENDER, CHART_TYPES.RADIAL_BAR,
            CHART_TITLES.GENDER, false, {
                labels: [CHART_LABELS.MALE, CHART_LABELS.FEMALE],
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

        overviewCharts[ELEMENT_IDS.RACE] = renderApexChart(
            ELEMENT_IDS.RACE, CHART_TYPES.PIE,
            CHART_TITLES.ETHNICITY, false, {
                labels: [CHART_LABELS.CHINESE, CHART_LABELS.MALAYS, CHART_LABELS.INDIANS, CHART_LABELS.OTHERS]
            }
        );

        overviewCharts[ELEMENT_IDS.RESIDENCY] = renderApexChart(
            ELEMENT_IDS.RESIDENCY, CHART_TYPES.PIE,
            CHART_TITLES.RESIDENCY, false, {
                labels: [CHART_LABELS.CITIZEN, CHART_LABELS.PR, CHART_LABELS.NON_RES]
            }
        );

        overviewCharts[ELEMENT_IDS.AGE_GROUP] = renderApexChart(
            ELEMENT_IDS.AGE_GROUP, CHART_TYPES.BAR,
            CHART_TITLES.AGE_GROUP, true, {
                plotOptions: { bar: { horizontal: true } },
                xaxis: { labels: { show: false } },
                yaxis: {
                    axisBorder: { show: true },
                    labels: { show: true }
                }
            }
        );

        overviewCharts[ELEMENT_IDS.MED_AGE] = renderApexChart(
            ELEMENT_IDS.MED_AGE, CHART_TYPES.RADIAL_BAR,
            CHART_TITLES.MEDIAN_AGE, false, {
                labels: [CHART_LABELS.CITIZEN, CHART_LABELS.RESIDENT],
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            value: { formatter: val => val }
                        }
                    }
                }
            }
        );

        return overviewCharts;
    }

    function initYearSelect() {
        let yearSelectEle = document.getElementById(ELEMENT_IDS.OVERVIEW_SEL_YEAR);
        let descYear = [..._years].sort(UTIL.compareAlphaNumDesc);
        for (let year of descYear) {
            let optEle = document.createElement('option');
            optEle.value = year;
            optEle.innerText = year;
            yearSelectEle.appendChild(optEle);
        }

        yearSelectEle.addEventListener('change', evt => {
            let selectedYear = evt.target.value || 0;
            if (selectedYear) {
                updateOverviewCharts(_dataByYear[selectedYear]);
            }
        });

        return yearSelectEle.value;
    }

    function updateOverviewCharts(annualData) {
        let totalCount = annualData[AP_DATA_KEYS.TOTAL_PPLT];

        let genderPrctArr = [annualData[AP_DATA_KEYS.TOTAL_MALE], annualData[AP_DATA_KEYS.TOTAL_FEMALE]].map(v => UTIL.getPercent(v, totalCount));
        _oCharts[ELEMENT_IDS.GENDER].updateOptions({
            series: genderPrctArr,
            plotOptions: {
                radialBar: {
                    dataLabels: { total: { formatter: w => totalCount } }
                }
            }
        });

        _oCharts[ELEMENT_IDS.RACE].updateSeries([
            annualData[AP_DATA_KEYS.TOTAL_CHINESE],
            annualData[AP_DATA_KEYS.TOTAL_MALAYS],
            annualData[AP_DATA_KEYS.TOTAL_INDIANS],
            annualData[AP_DATA_KEYS.TOTAL_OTHER_ETHN]
        ]);

        _oCharts[ELEMENT_IDS.RESIDENCY].updateSeries([
            annualData[AP_DATA_KEYS.CITIZEN_PPLT],
            annualData[AP_DATA_KEYS.PR_PPLT],
            annualData[AP_DATA_KEYS.NON_RES_PPLT]
        ]);

        let ageGroup = Object.keys(annualData[AP_DATA_KEYS.TOTAL_FEMALE_AGE]).filter(k => !k.includes('over'));
        let ageGroupOpt = {
            dataLabels: {
                formatter: (val, opts) => {
                    return UTIL.getPercent(Math.abs(val), totalCount) + '%';
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
        _oCharts[ELEMENT_IDS.AGE_GROUP].updateOptions(ageGroupOpt);

        _oCharts[ELEMENT_IDS.MED_AGE].updateSeries([
            annualData[AP_DATA_KEYS.MED_AGE_CITIZEN],
            annualData[AP_DATA_KEYS.MED_AGE_RESIDENT]
        ]);
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
                group: CHART_CONF.GROUP_RESIDENCY,
                sparkline: { enabled: true },
                type: CHART_TYPES.AREA
            },
            CHART_LABELS.CITIZEN
        );

        trendCharts[ELEMENT_IDS.TREND_PR] = renderSyncApexChart(
            ELEMENT_IDS.TREND_PR, {
                id: ELEMENT_IDS.TREND_PR,
                group: CHART_CONF.GROUP_RESIDENCY,
                sparkline: { enabled: true },
                type: CHART_TYPES.AREA
            },
            CHART_LABELS.PR
        );

        trendCharts[ELEMENT_IDS.TREND_NONRES] = renderSyncApexChart(
            ELEMENT_IDS.TREND_NONRES, {
                id: ELEMENT_IDS.TREND_NONRES,
                group: CHART_CONF.GROUP_RESIDENCY,
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
                group: CHART_CONF.GROUP_MEDAGE,
                sparkline: { enabled: true },
                type: CHART_TYPES.AREA
            },
            `${CHART_LABELS.MEDIAN_AGE} (${CHART_LABELS.CITIZEN})`
        );

        trendCharts[ELEMENT_IDS.TREND_MEDAGE_CITIZEN] = renderSyncApexChart(
            ELEMENT_IDS.TREND_MEDAGE_CITIZEN, {
                id: ELEMENT_IDS.TREND_MEDAGE_CITIZEN,
                group: CHART_CONF.GROUP_MEDAGE,
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

    function updateTrendCharts(yearRange) {
        function getYearSeriesChartData(key) {
            let series = yearRange.map(y => {
                return _yearData[y][key] ? _yearData[y][key] : null;
            });
            return series;
        }

        function togglePopulationGrowth() {
            let enabledOnSeries = [];
            let series = [];
            let yaxis = [];

            if (lastPopIncrBarCount == 1) {
                // if previously was population data, update to gender data
                series = [{
                    name: CHART_LABELS.MALE,
                    data: getYearSeriesChartData(AP_DATA_KEYS.TOTAL_MALE),
                    type: CHART_TYPES.COLUMN
                }, {
                    name: CHART_LABELS.FEMALE,
                    data: getYearSeriesChartData(AP_DATA_KEYS.TOTAL_FEMALE),
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
                    data: getYearSeriesChartData(AP_DATA_KEYS.TOTAL_CHINESE),
                    type: CHART_TYPES.COLUMN
                }, {
                    name: CHART_LABELS.MALAYS,
                    data: getYearSeriesChartData(AP_DATA_KEYS.TOTAL_MALAYS),
                    type: CHART_TYPES.COLUMN
                }, {
                    name: CHART_LABELS.INDIANS,
                    data: getYearSeriesChartData(AP_DATA_KEYS.TOTAL_INDIANS),
                    type: CHART_TYPES.COLUMN
                }, {
                    name: CHART_LABELS.OTHERS,
                    data: getYearSeriesChartData(AP_DATA_KEYS.TOTAL_OTHER_ETHN),
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
                    data: getYearSeriesChartData(AP_DATA_KEYS.TOTAL_PPLT),
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
                data: getYearSeriesChartData(AP_DATA_KEYS.RATE_NATURAL_INCR),
                type: CHART_TYPES.LINE
            }, {
                name: CHART_LABELS.RATE_POPLT_INCR,
                data: getYearSeriesChartData(AP_DATA_KEYS.TOTAL_PPLT_GROWTH),
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
                data: getYearSeriesChartData(AP_DATA_KEYS.CITIZEN_PPLT)
            }]
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_PR].updateOptions({
            labels: yearRange,
            colors: [CHART_CONF.COLOR_RANGE[1]],
            series: [{
                name: CHART_LABELS.PR,
                data: getYearSeriesChartData(AP_DATA_KEYS.PR_PPLT)
            }]
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_NONRES].updateOptions({
            labels: yearRange,
            colors: [CHART_CONF.COLOR_RANGE[2]],
            series: [{
                name: CHART_LABELS.NON_RES,
                data: getYearSeriesChartData(AP_DATA_KEYS.NON_RES_PPLT)
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
                data: getYearSeriesChartData(AP_DATA_KEYS.MED_AGE_RESIDENT)
            }]
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_MEDAGE_CITIZEN].updateOptions({
            labels: yearRange,
            colors: [CHART_CONF.COLOR_RANGE[4]],
            series: [{
                name: CHART_LABELS.CITIZEN,
                data: getYearSeriesChartData(AP_DATA_KEYS.MED_AGE_CITIZEN)
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
                data: getYearSeriesChartData(AP_DATA_KEYS.AGE_DEP_15_64),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.AGE_DEP_20_64,
                data: getYearSeriesChartData(AP_DATA_KEYS.AGE_DEP_20_64),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.CHILD_DEP_15_64,
                data: getYearSeriesChartData(AP_DATA_KEYS.CHILD_DEP_15_64),
                type: CHART_TYPES.LINE,
            }, {
                name: CHART_LABELS.CHILD_DEP_20_64,
                data: getYearSeriesChartData(AP_DATA_KEYS.CHILD_DEP_20_64),
                type: CHART_TYPES.LINE
            }, {
                name: CHART_LABELS.OLD_DEP_15_64,
                data: getYearSeriesChartData(AP_DATA_KEYS.OLD_DEP_15_64),
                type: CHART_TYPES.LINE
            }, {
                name: CHART_LABELS.OLD_DEP_20_64,
                data: getYearSeriesChartData(AP_DATA_KEYS.OLD_DEP_20_64),
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

function initGeoDistrCharts() {
    let geoCharts = {};

    geoCharts[ELEMENT_IDS.GEO_AGE_GROUP] = renderApexChart(
        ELEMENT_IDS.GEO_AGE_GROUP, CHART_TYPES.BAR,
        CHART_TITLES.AGE_GROUP, false, {
            dataLabels: { enabled: false },
            plotOptions: { bar: { horizontal: true } },
            xaxis: { labels: { show: false } }
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
        CHART_TITLES.DWELLING_TYPE, false, { legend: { show: false } }
    );

    geoCharts[ELEMENT_IDS.GEO_TENANCY] = renderApexChart(
        ELEMENT_IDS.GEO_TENANCY, CHART_TYPES.PIE,
        CHART_TITLES.TENANCY_TYPE, false, { dataLabels: { enabled: true } }
    );

    geoCharts[ELEMENT_IDS.GEO_EDUCATION] = renderApexChart(
        ELEMENT_IDS.GEO_EDUCATION, CHART_TYPES.RADAR,
        CHART_TITLES.QUALIFICATION, false, {
            dataLabels: { enabled: true },
            xaxis: {
                labels: {
                    style: {
                        colors: CHART_CONF.COLOR_RANGE,
                        fontSize: "13px",
                        fontFamily: 'Nunito Sans,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif'
                    }
                }
            }
        }
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
            dataLabels: { enabled: true },
            xaxis: { labels: { show: false } },
            yaxis: { labels: { show: false } }
        }
    );

    geoCharts[ELEMENT_IDS.GEO_INCOME] = renderApexChart(
        ELEMENT_IDS.GEO_INCOME, CHART_TYPES.LINE,
        CHART_TITLES.INCOME, false, {
            dataLabels: { enabled: false },
            xaxis: { labels: { show: false } },
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
            xaxis: { labels: { show: false } },
            yaxis: { show: false, labels: { show: true } }
        }
    );

    geoCharts[ELEMENT_IDS.GEO_TRAVEL] = renderApexChart(
        ELEMENT_IDS.GEO_TRAVEL, CHART_TYPES.POLAR_AREA,
        CHART_TITLES.TRAVEL_TIME, false, { dataLabels: { enabled: true } }
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
                        let genderPrctArr = [agMale[key], agFemale[key]].map(v => UTIL.getPercent(v, agTotal[key]));
                        charts[ELEMENT_IDS.GEO_AGE_GENDER].updateOptions({
                            chart: {
                                width: '30%'
                            },
                            series: genderPrctArr
                        });

                        if (!genderEle.classList.contains(ELEMENT_STATES.ACTIVE)) {
                            mChart.updateOptions({
                                chart: {
                                    width: '70%'
                                }
                            });
                            agEle.classList.add('gender-activated');
                            genderEle.classList.add(ELEMENT_STATES.ACTIVE);
                        }
                    } else if (selDataPoints[0].length === 0) {
                        agEle.classList.remove('gender-activated')
                        genderEle.classList.remove(ELEMENT_STATES.ACTIVE);
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
    let ageGroupSeries = ageGroupData ? { series: [{ data: ageGroupLabels.map(k => agTotal[k]) }] } : { series: [], noData: CHART_CONF.NO_DATA_OPT };
    ageGroupOpt = {...ageGroupOpt, ...ageGroupSeries };
    charts[ELEMENT_IDS.GEO_AGE_GROUP].updateOptions(ageGroupOpt);
    charts[ELEMENT_IDS.GEO_RACE].updateSeries([
        raceData[GD_DATA_KEYS.CHINESE],
        raceData[GD_DATA_KEYS.MALAYS],
        raceData[GD_DATA_KEYS.INDIANS],
        raceData[GD_DATA_KEYS.OTHERS]
    ]);

    let dwellOpt = {
        chart: { toolbar: { show: false } },
        dataLabels: {
            formatter: val => [(UTIL.dwellToggleLabel(val) || val), UTIL.getPercent(val, dwellData[GD_DATA_KEYS.TOTAL]) + '%']
        }
    };
    let dwellSeries = dwellData ? { series: [{ data: Object.entries(dwellData).map(d => { return { x: d[0], y: d[1] } }).filter(d => (!d.x.includes(GD_DATA_KEYS.TOTAL) && d.y)) }] } : { series: [], noData: CHART_CONF.NO_DATA_OPT };
    dwellOpt = {...dwellOpt, ...dwellSeries };
    charts[ELEMENT_IDS.GEO_DWELLING].updateOptions(dwellOpt);

    let tenantLabels = Object.keys(tenantData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    // let tenantSeries = tenantData ? {
    //     series: [{
    //         data: Object.entries(dwellData).map(d => { return { x: d[0], y: d[1] } }).filter(d => (!d.x.includes(GD_DATA_KEYS.TOTAL) && d.y))
    //     }]
    // } : {
    //     series: [],
    //     noData: CHART_CONF.NO_DATA_OPT
    // };
    charts[ELEMENT_IDS.GEO_TENANCY].updateOptions({
        series: tenantLabels.map(k => tenantData[k]),
        labels: tenantLabels
    });

    let eduTypeLabels = Object.keys(eduData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    charts[ELEMENT_IDS.GEO_EDUCATION].updateOptions({
        series: [{
            name: CHART_LABELS.POPULATION,
            data: eduTypeLabels.map(k => eduData[k])
        }],
        xaxis: {
            categories: eduTypeLabels,
            labels: { formatter: val => (UTIL.eduToggleLabel(val) || val) }
        }
    });

    let litLabels = Object.keys(litData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL) && !k.startsWith(GD_DATA_KEYS.LIT));
    charts[ELEMENT_IDS.GEO_LITERACY].updateOptions({
        labels: litLabels.map(k => (UTIL.litToggleLabel(k) || k)),
        plotOptions: {
            radialBar: {
                dataLabels: { total: { formatter: w => litData[GD_DATA_KEYS.TOTAL] } }
            }
        },
        series: litLabels.map(k => {
            let val = litData[k];
            val = Array.isArray(val) ? val.map(o => UTIL.getNum(o.value)).reduce((p, a) => a += p) :
                val;
            return UTIL.getPercent(val, litData[GD_DATA_KEYS.TOTAL]);
        })
    });

    let occupationLabels = Object.keys(occupationData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    charts[ELEMENT_IDS.GEO_OCCUPATION].updateOptions({
        dataLabels: {
            enabled: true,
            formatter: val => UTIL.getPercent(val, occupationData[GD_DATA_KEYS.TOTAL]) + '%'
        },
        series: [{
            name: CHART_LABELS.POPULATION,
            data: occupationLabels.map(k => occupationData[k])
        }],
        xaxis: { categories: occupationLabels.map(k => k.replace('1/', '')) }
    });

    let incomeLabels = Object.keys(incomeData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    charts[ELEMENT_IDS.GEO_INCOME].updateOptions({
        series: [{
            name: CHART_LABELS.POPULATION,
            data: incomeLabels.map(k => incomeData[k])
        }],
        xaxis: {
            categories: incomeLabels.map(k => {
                let prepend = k.startsWith('Over') ? '>= $' : '<= $';
                return prepend + UTIL.incomeToggleLabel(k, true);
            })
        }
    });

    let transportLabels = Object.keys(transportData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    charts[ELEMENT_IDS.GEO_TRANSPORT].updateOptions({
        series: [{
            name: CHART_LABELS.POPULATION,
            data: transportLabels.map(k => transportData[k])
        }],
        dataLabels: {
            enabled: true,
            formatter: val => UTIL.getPercent(val, transportData[GD_DATA_KEYS.TOTAL]) + '%'
        },
        xaxis: { categories: transportLabels.map(k => k.replace('1/', '')) },
        yaxis: {
            show: false,
            labels: { show: false, formatter: val => (UTIL.transportToggleLabel(val) || val) }
        }
    });

    let travelLabels = Object.keys(travelTimeData).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
    charts[ELEMENT_IDS.GEO_TRAVEL].updateOptions({
        labels: travelLabels.map(k => (UTIL.travelToggleLabel(k) || k)),
        series: travelLabels.map(k => travelTimeData[k]),
    });

}

function initComparisonCharts() {
    let compCharts = {
        residents: {},
        housing: {},
        education: {},
        employed: {}
    };

    compCharts.residents[ELEMENT_IDS.COMPARE_GENDER] = renderApexChart(
        ELEMENT_IDS.COMPARE_GENDER, CHART_TYPES.LINE,
        CHART_TITLES.GENDER, false, {
            dataLabels: {
                enabled: true,
                enabledOnSeries: [2]
            }
        }
    );

    compCharts.residents[ELEMENT_IDS.COMPARE_RACE] = renderApexChart(
        ELEMENT_IDS.COMPARE_RACE, CHART_TYPES.BAR,
        CHART_TITLES.RACE, true, null
    );

    compCharts.housing[ELEMENT_IDS.COMPARE_DWELLING] = renderApexChart(
        ELEMENT_IDS.COMPARE_DWELLING, CHART_TYPES.TREE_MAP,
        CHART_TITLES.DWELLING_TYPE, false, {
            plotOptions: { treemap: { distributed: false, enableShades: true } },
            legend: { show: true }
        }
    );

    compCharts.housing[ELEMENT_IDS.COMPARE_TEN_OWNER] = renderSyncApexChart(
        ELEMENT_IDS.COMPARE_TEN_OWNER, {
            id: ELEMENT_IDS.COMPARE_TEN_OWNER,
            group: CHART_CONF.GROUP_CP_TENANCY,
            sparkline: { enabled: true },
            type: CHART_TYPES.AREA
        },
        CHART_LABELS.OWNER
    );

    compCharts.housing[ELEMENT_IDS.COMPARE_TEN_RENT] = renderSyncApexChart(
        ELEMENT_IDS.COMPARE_TEN_RENT, {
            id: ELEMENT_IDS.COMPARE_TEN_RENT,
            group: CHART_CONF.GROUP_CP_TENANCY,
            sparkline: { enabled: true },
            type: CHART_TYPES.AREA
        },
        CHART_LABELS.RENTED
    );

    compCharts.housing[ELEMENT_IDS.COMPARE_TEN_OTHERS] = renderSyncApexChart(
        ELEMENT_IDS.COMPARE_TEN_OTHERS, {
            id: ELEMENT_IDS.COMPARE_TEN_OTHERS,
            group: CHART_CONF.GROUP_CP_TENANCY,
            sparkline: { enabled: true },
            type: CHART_TYPES.AREA
        },
        CHART_LABELS.OTHERS
    );

    compCharts.education[ELEMENT_IDS.COMPARE_EDUCATION] = renderApexChart(
        ELEMENT_IDS.COMPARE_EDUCATION, CHART_TYPES.HEAT_MAP,
        CHART_TITLES.QUALIFICATION, false, {
            dataLabels: { enabled: false },
            yaxis: { labels: { show: false } }
        }
    );

    compCharts.education[ELEMENT_IDS.COMPARE_LITERACY] = renderApexChart(
        ELEMENT_IDS.COMPARE_LITERACY, CHART_TYPES.HEAT_MAP,
        CHART_TITLES.LITERACY, false, {
            dataLabels: { enabled: false },
            yaxis: { labels: { show: false } }
        }
    );


    compCharts.employed[ELEMENT_IDS.COMPARE_OCCUPATION] = renderApexChart(
        ELEMENT_IDS.COMPARE_OCCUPATION, CHART_TYPES.BAR,
        CHART_TITLES.OCCUPATION, true, {
            dataLabels: { enabled: false },
            plotOptions: { bar: { horizontal: true, }, },
            xaxis: { labels: { show: false } }
        }
    );

    compCharts.employed[ELEMENT_IDS.COMPARE_INCOME] = renderApexChart(
        ELEMENT_IDS.COMPARE_INCOME, CHART_TYPES.BUBBLE,
        CHART_TITLES.INCOME, true, {
            dataLabels: { enabled: false },
            fill: { opacity: 0.9 },
            yaxis: { labels: { show: false } },
            xaxis: { labels: { show: false }, tickAmount: 'dataPoints', type: 'numeric' }
        }
    );

    compCharts.employed[ELEMENT_IDS.COMPARE_TRANSPORT] = renderApexChart(
        ELEMENT_IDS.COMPARE_TRANSPORT, CHART_TYPES.LINE,
        CHART_TITLES.TRANSPORT, false, {
            xaxis: { labels: { show: false } },
            yaxis: { labels: { show: false } }
        }
    );

    compCharts.employed[ELEMENT_IDS.COMPARE_TRAVEL] = renderApexChart(
        ELEMENT_IDS.COMPARE_TRAVEL, CHART_TYPES.BAR,
        CHART_TITLES.TRAVEL_TIME, true, {
            dataLabels: { enabled: false },
            plotOptions: { bar: { horizontal: true, }, },
            xaxis: { labels: { show: false } }
        }
    );

    return compCharts;
}

function updateComparisonCharts(_type, _areasList, _geoDistrData, _catCharts) {
    function getAreaSeriesChartData(catData, key) {
        let series = _areasList.map(a => {
            return catData[a][key] ? catData[a][key] : null;
        });
        return series;
    }

    let filteredSeriesObj = {};
    let {
        genderPopulation,
        ethnicGroup,
        dwellingType,
        tenancyType,
        qualification,
        literacy,
        occupation,
        grossIncome,
        transportMode: transportData,
        travelTime: travelData
    } = _geoDistrData;
    _areasList.sort(UTIL.compareAlphaNumAsc);

    for (let [cat, data] of Object.entries(_geoDistrData)) {
        for (let area in data) {
            if (_areasList.includes(area)) {
                filteredSeriesObj[cat] = {...filteredSeriesObj[cat],
                    ... {
                        [area]: data[area]
                    }
                };
            }
        }
    }

    if (_type === CHART_CONF.CAT_RESIDENTS) {
        _catCharts[ELEMENT_IDS.COMPARE_GENDER].updateOptions({
            labels: _areasList,
            series: [{
                name: CHART_LABELS.FEMALE,
                data: getAreaSeriesChartData(genderPopulation, GD_DATA_KEYS.FEMALES),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.MALE,
                data: getAreaSeriesChartData(genderPopulation, GD_DATA_KEYS.MALES),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.POPULATION,
                data: getAreaSeriesChartData(genderPopulation, GD_DATA_KEYS.TOTAL),
                type: CHART_TYPES.LINE
            }],
            yaxis: [{
                labels: { show: false },
                seriesName: CHART_LABELS.FEMALE
            }, {
                labels: { show: false },
                seriesName: CHART_LABELS.MALE
            }, {
                labels: { show: false },
                opposite: true,
                seriesName: CHART_LABELS.POPULATION
            }]
        });

        _catCharts[ELEMENT_IDS.COMPARE_RACE].updateOptions({
            labels: _areasList,
            series: [{
                name: CHART_LABELS.CHINESE,
                data: getAreaSeriesChartData(ethnicGroup, GD_DATA_KEYS.CHINESE),
            }, {
                name: CHART_LABELS.MALAYS,
                data: getAreaSeriesChartData(ethnicGroup, GD_DATA_KEYS.MALAYS),
            }, {
                name: CHART_LABELS.INDIANS,
                data: getAreaSeriesChartData(ethnicGroup, GD_DATA_KEYS.INDIANS),
            }, {
                name: CHART_LABELS.OTHERS,
                data: getAreaSeriesChartData(ethnicGroup, GD_DATA_KEYS.OTHERS)
            }]
        });
    } else if (_type === CHART_CONF.CAT_HOUSING) {
        _catCharts[ELEMENT_IDS.COMPARE_DWELLING].updateOptions({
            chart: { toolbar: { show: false } },
            dataLabels: {
                formatter: (val, op) => [(UTIL.dwellToggleLabel(val) || text), op.value]
            },
            series: _areasList.map(a => {
                return {
                    name: a,
                    data: Object.entries(dwellingType[a]).map(d => { return { x: d[0], y: d[1] } }).filter(d => (!d.x.includes(GD_DATA_KEYS.TOTAL)))
                }
            })
        });

        _catCharts[ELEMENT_IDS.COMPARE_TEN_OWNER].updateOptions({
            labels: _areasList,
            colors: [CHART_CONF.COLOR_RANGE[0]],
            series: [{
                name: CHART_LABELS.OWNER,
                data: getAreaSeriesChartData(tenancyType, GD_DATA_KEYS.OWNER_OCCUPIED)
            }]
        }, true, true, false);

        _catCharts[ELEMENT_IDS.COMPARE_TEN_RENT].updateOptions({
            labels: _areasList,
            colors: [CHART_CONF.COLOR_RANGE[1]],
            series: [{
                name: CHART_LABELS.RENTED,
                data: getAreaSeriesChartData(tenancyType, GD_DATA_KEYS.RENTED)
            }]
        }, true, true, false);

        _catCharts[ELEMENT_IDS.COMPARE_TEN_OTHERS].updateOptions({
            labels: _areasList,
            colors: [CHART_CONF.COLOR_RANGE[2]],
            series: [{
                name: CHART_LABELS.OTHERS,
                data: getAreaSeriesChartData(tenancyType, GD_DATA_KEYS.OTHERS)
            }]
        }, true, true, false);
    } else if (_type === CHART_CONF.CAT_EDUCATION) {
        _catCharts[ELEMENT_IDS.COMPARE_EDUCATION].updateOptions({
            series: _areasList.map(a => {
                return {
                    name: a,
                    data: Object.entries(qualification[a]).map(d => {
                        d[0];
                        return { x: (UTIL.eduToggleLabel(d[0]) || d[0]), y: d[1] }
                    }).filter(d => !d.x.includes(GD_DATA_KEYS.TOTAL))
                }
            })
        }, true);
        _catCharts[ELEMENT_IDS.COMPARE_LITERACY].updateOptions({
            series: _areasList.map(a => {
                return {
                    name: a,
                    data: Object.entries(literacy[a]).map(d => {
                        let val = d[1];
                        val = Array.isArray(val) ?
                            val.map(o => UTIL.getNum(o.value)).reduce((p, a) => a += p) :
                            val;
                        return { x: (UTIL.litToggleLabel(d[0]) || d[0]), y: val }
                    }).filter(d => !d.x.includes(GD_DATA_KEYS.TOTAL) && !d.x.startsWith(GD_DATA_KEYS.LIT))
                }
            })
        }, true);
    } else if (_type === CHART_CONF.CAT_EMPLOYED) {
        let jobList = Object.keys(occupation[_areasList[0]]).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));;
        _catCharts[ELEMENT_IDS.COMPARE_OCCUPATION].updateOptions({
            labels: _areasList,
            series: jobList.map(j => {
                return {
                    name: j == GD_DATA_KEYS.OTHERS_1 ? j.replace('1/', '') : j,
                    data: getAreaSeriesChartData(occupation, j)
                }
            })
        });

        let incomeBrackets = Object.keys(grossIncome[_areasList[0]]).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
        _catCharts[ELEMENT_IDS.COMPARE_INCOME].updateOptions({
            series: _areasList.map(a => {
                return {
                    name: a,
                    data: incomeBrackets.map(i => {
                        let totalCount = grossIncome[a][GD_DATA_KEYS.TOTAL];
                        let popCount = grossIncome[a][i] || 0;
                        return [UTIL.incomeToggleLabel(i, true), popCount, UTIL.getPercent(popCount, totalCount)];
                    })
                }
            }),
            tooltip: {
                x: { formatter: val => (UTIL.incomeToggleLabel(val) || val) },
                z: {
                    formatter: (val) => val + '%',
                    title: 'Population % over area: '
                }
            }
        });

        let transportModes = Object.keys(transportData[_areasList[0]]).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
        _catCharts[ELEMENT_IDS.COMPARE_TRANSPORT].updateOptions({
            series: _areasList.map(a => {
                return {
                    name: a,
                    data: transportModes.map(t => transportData[a][t])
                }
            }),
            xaxis: {
                categories: transportModes.map(t => (UTIL.transportToggleLabel(t) || t))
            }
        });

        let travelTime = Object.keys(travelData[_areasList[0]]).filter(k => !k.includes(GD_DATA_KEYS.TOTAL));
        _catCharts[ELEMENT_IDS.COMPARE_TRAVEL].updateOptions({
            labels: _areasList,
            series: travelTime.map(t => {
                return {
                    name: UTIL.travelToggleLabel(t) || t,
                    data: getAreaSeriesChartData(travelData, t)
                }
            })
        });
    }
}