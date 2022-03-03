function getYearSeriesChartData(years, data, key) {
    let series = years.map(y => {
        return data[y][key] ? data[y][key] : null;
    });
    return series;
}

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

function doPopulationOverview(years, dataByYear) {
    function getOverviewCharts() {
        let overviewCharts = {};

        overviewCharts[ELEMENT_IDS.RESIDENCY] = renderApexChart(
            ELEMENT_IDS.RESIDENCY, CHART_TYPES.PIE,
            CHART_TITLES.RESIDENCY, false, { labels: [CHART_LABELS.CITIZEN, CHART_LABELS.PR, CHART_LABELS.NON_RES] }
        );

        overviewCharts[ELEMENT_IDS.RACE] = renderApexChart(
            ELEMENT_IDS.RACE, CHART_TYPES.PIE,
            CHART_TITLES.ETHNICITY, false, { labels: [CHART_LABELS.CHINESE, CHART_LABELS.MALAYS, CHART_LABELS.INDIANS, CHART_LABELS.OTHERS] }
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
            }
        };

        charts[ELEMENT_IDS.GENDER].updateSeries(genderPrctArr);
        charts[ELEMENT_IDS.MED_AGE].updateSeries([
            populationData[DOS_DATA_KEYS.MED_AGE_CITIZEN],
            populationData[DOS_DATA_KEYS.MED_AGE_RESIDENT]
        ]);
        charts[ELEMENT_IDS.RESIDENCY].updateSeries([
            populationData[DOS_DATA_KEYS.CITIZEN_PPLT],
            populationData[DOS_DATA_KEYS.PR_PPLT],
            populationData[DOS_DATA_KEYS.NON_RES_PPLT]
        ]);
        charts[ELEMENT_IDS.RACE].updateSeries([
            populationData[DOS_DATA_KEYS.TOTAL_CHINESE],
            populationData[DOS_DATA_KEYS.TOTAL_MALAYS],
            populationData[DOS_DATA_KEYS.TOTAL_INDIANS],
            populationData[DOS_DATA_KEYS.TOTAL_OTHER_ETHN]
        ]);
        charts[ELEMENT_IDS.AGE_GROUP].updateOptions(ageGroupOpt);
    }

    function initYearSelect(charts, years, dataByYear) {
        function updateOverviewElements(populationData) {
            document.getElementById(ELEMENT_IDS.POPULATION).querySelector('span').innerText = populationData[DOS_DATA_KEYS.TOTAL_PPLT];
        }

        let yearSelectEle = document.getElementById(ELEMENT_IDS.OVERVIEW_SEL_YEAR);
        let descYear = [...years].sort(UTIL.compareAlphaNumDesc);
        for (let year of descYear) {
            let optEle = document.createElement('option');
            optEle.value = year;
            optEle.innerText = year;
            yearSelectEle.appendChild(optEle);
        }

        updateOverviewElements(dataByYear[yearSelectEle.value]);

        yearSelectEle.addEventListener('change', evt => {
            let selectedYear = evt.target.value || 0;
            if (selectedYear) {
                updateOverviewCharts(charts, dataByYear[selectedYear]);
                updateOverviewElements(dataByYear[selectedYear]);
            }
        });

        return yearSelectEle.value;
    }

    let chartObj = getOverviewCharts();
    let initYear = initYearSelect(chartObj, years, dataByYear)
    updateOverviewCharts(chartObj, dataByYear[initYear]);
}

function doPopulationTrend(_years, _yearData) {
    function initTrendCharts() {
        let trendCharts = {};

        trendCharts[ELEMENT_IDS.TREND_POPINCR] = renderApexChart(
            ELEMENT_IDS.TREND_POPINCR, CHART_TYPES.AREA,
            CHART_TITLES.POP_GROWTH, false, {
                xaxis: { labels: { show: false } },
                yaxis: { labels: { show: false } }
            }
        );

        // trendCharts[ELEMENT_IDS.TREND_GENDER] = renderApexChart(
        //     ELEMENT_IDS.TREND_GENDER, CHART_TYPES.BAR,
        //     CHART_TITLES.GENDER, false, {
        //         dataLabels: { enabled: false },
        //         xaxis: { labels: { show: false } },
        //         yaxis: { labels: { show: false } }
        //     }
        // );

        // trendCharts[ELEMENT_IDS.TREND_RACE] = renderApexChart(
        //     ELEMENT_IDS.TREND_RACE, CHART_TYPES.BAR,
        //     CHART_TITLES.ETHNICITY, true, {
        //         dataLabels: { enabled: false },
        //         xaxis: { labels: { show: false } },
        //         yaxis: { labels: { show: false } }
        //     }
        // );

        trendCharts[ELEMENT_IDS.TREND_CITIZEN] = renderSyncApexChart(
            ELEMENT_IDS.TREND_CITIZEN, {
                id: ELEMENT_IDS.TREND_CITIZEN,
                group: 'residency',
                type: CHART_TYPES.AREA,
                sparkline: { enabled: true }
            },
            CHART_LABELS.CITIZEN
        );

        trendCharts[ELEMENT_IDS.TREND_PR] = renderSyncApexChart(
            ELEMENT_IDS.TREND_PR, {
                id: ELEMENT_IDS.TREND_PR,
                group: 'residency',
                type: CHART_TYPES.AREA,
                sparkline: { enabled: true }
            },
            CHART_LABELS.PR
        );

        trendCharts[ELEMENT_IDS.TREND_NONRES] = renderSyncApexChart(
            ELEMENT_IDS.TREND_NONRES, {
                id: ELEMENT_IDS.TREND_NONRES,
                group: 'residency',
                type: CHART_TYPES.AREA,
                sparkline: { enabled: true }
            },
            CHART_LABELS.NON_RES
        );

        trendCharts[ELEMENT_IDS.TREND_AGE] = renderApexChart(
            ELEMENT_IDS.TREND_AGE, CHART_TYPES.BAR,
            CHART_TITLES.MEDIAN_AGE_INS, false, {
                xaxis: { labels: { show: false } },
                yaxis: { labels: { show: false } }
            }
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
                let newRange = _years.slice(_years.indexOf(yearStartEle.value), _years.indexOf(yearEndEle.value) + 1)
                updateTrendCharts(newRange);
            }
        });

        return [yearStartEle.value, yearEndEle.value]
    }

    function togglePopulationGrowth(yearRange) {
        let series = [];
        let yaxis = [];
        let enabledOnSeries = [];

        if (lastPopIncrBarCount == 1) {
            // if previously was population data, update to gender data
            series = [{
                name: CHART_LABELS.MALE,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_MALE),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.FEMALE,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_FEMALE),
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
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_CHINESE),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.MALAYS,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_MALAYS),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.INDIANS,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_INDIANS),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.OTHERS,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_OTHER_ETHN),
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
            // update to population data
            series = [{
                name: CHART_LABELS.POPULATION,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_PPLT),
                type: CHART_TYPES.COLUMN
            }];
            yaxis = [{
                labels: { show: false },
                seriesName: CHART_LABELS.POPULATION
            }];
        }

        series.push({
            name: CHART_LABELS.RATE_NATURAL_INCR,
            data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.RATE_NATURAL_INCR),
            type: CHART_TYPES.LINE
        }, {
            name: CHART_LABELS.RATE_POPLT_INCR,
            data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_PPLT_GROWTH),
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
        console.log({
            dataLabels: {
                enabledOnSeries
            },
            labels: yearRange,
            series,
            yaxis
        });

        _tCharts[ELEMENT_IDS.TREND_POPINCR].updateOptions({
            dataLabels: {
                enabledOnSeries
            },
            labels: yearRange,
            series,
            yaxis
        }, true, true);

    }

    function updateTrendCharts(yearRange) {
        _tCharts[ELEMENT_IDS.TREND_CITIZEN].updateOptions({
            series: [{
                name: CHART_LABELS.CITIZEN,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.CITIZEN_PPLT)
            }],
            labels: yearRange
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_PR].updateOptions({
            series: [{
                name: CHART_LABELS.PR,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.PR_PPLT)
            }],
            labels: yearRange
        }, true, true, false);

        _tCharts[ELEMENT_IDS.TREND_NONRES].updateOptions({
            series: [{
                name: CHART_LABELS.NON_RES,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.NON_RES_PPLT)
            }],
            labels: yearRange
        }, true, true, false);

        lastPopIncrBarCount = 1;
        _tCharts[ELEMENT_IDS.TREND_POPINCR].updateOptions({
            chart: {
                toolbar: {
                    tools: {
                        customIcons: [{
                            icon: '<i class="fa-solid fa-chart-column"></i>',
                            index: 2,
                            title: 'Toggle Column Type',
                            class: 'growth-toggle',
                            click: function(tChart, opt, evt) {
                                togglePopulationGrowth(yearRange);
                                lastPopIncrBarCount = opt.globals.comboBarCount;
                            }
                        }]
                    }
                }
            },
            dataLabels: {
                enabled: true,
                enabledOnSeries: [1, 2]
            },
            series: [{
                    name: CHART_LABELS.POPULATION,
                    data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_PPLT),
                    type: CHART_TYPES.COLUMN
                },
                {
                    name: CHART_LABELS.RATE_NATURAL_INCR,
                    data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.RATE_NATURAL_INCR)
                }, {
                    name: CHART_LABELS.RATE_POPLT_INCR,
                    data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.TOTAL_PPLT_GROWTH)
                }
            ],
            labels: yearRange,
            yaxis: [{
                labels: { show: false },
                seriesName: CHART_LABELS.POPULATION
            }, {
                labels: { show: false },
                opposite: true,
                seriesName: CHART_LABELS.RATE_NATURAL_INCR
            }, {
                labels: { show: false },
                opposite: true,
                seriesName: CHART_LABELS.RATE_POPLT_INCR
            }]
        });

        _tCharts[ELEMENT_IDS.TREND_AGE].updateOptions({
            series: [{
                name: CHART_LABELS.CITIZEN,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.MED_AGE_CITIZEN)
            }, {
                name: CHART_LABELS.RESIDENT,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.MED_AGE_RESIDENT)
            }],
            labels: yearRange
        });

        _tCharts[ELEMENT_IDS.TREND_DEPENDENCY].updateOptions({
            series: [{
                name: CHART_LABELS.AGE_DEP_15_64,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.AGE_DEP_15_64),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.AGE_DEP_20_64,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.AGE_DEP_20_64),
                type: CHART_TYPES.COLUMN
            }, {
                name: CHART_LABELS.CHILD_DEP_15_64,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.CHILD_DEP_15_64),
                type: CHART_TYPES.AREA,
            }, {
                name: CHART_LABELS.CHILD_DEP_20_64,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.CHILD_DEP_20_64),
                type: CHART_TYPES.AREA
            }, {
                name: CHART_LABELS.OLD_DEP_15_64,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.OLD_DEP_15_64),
                type: CHART_TYPES.LINE
            }, {
                name: CHART_LABELS.OLD_DEP_20_64,
                data: getYearSeriesChartData(yearRange, _yearData, DOS_DATA_KEYS.OLD_DEP_20_64),
                type: CHART_TYPES.LINE
            }],
            labels: yearRange
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
        [MAP_LAYER_PROPS.TOTAL]: agTotal, [MAP_LAYER_PROPS.FEMALES]: agFemale, [MAP_LAYER_PROPS.MALES]: agMale
    } = ageGroupData;
    let ageGroupLabels = Object.keys(agTotal).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL)).sort(UTIL.compareAlphaNumDesc);
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
                let label = text == MAP_LAYER_PROPS.HDB_DWELL ? CHART_LABELS.HDB :
                    text == MAP_LAYER_PROPS.CONDO_OTH ? CHART_LABELS.CONDO :
                    text == MAP_LAYER_PROPS.LANDED_PROP ? CHART_LABELS.LANDED :
                    CHART_LABELS.OTHERS;
                let percentage = Math.round((op.value / dwellData[MAP_LAYER_PROPS.TOTAL]) * 100) + '%';
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

    let tenantLabels = Object.keys(tenantData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let tenantOpt = {
        series: tenantLabels.map(k => tenantData[k]),
        labels: tenantLabels
    };

    let eduTypeLabels = Object.keys(eduData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let educationOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: eduTypeLabels.map(k => eduData[k])
        }],
        xaxis: {
            categories: eduTypeLabels,
            labels: {
                formatter: (text) => {
                    return text == MAP_LAYER_PROPS.UNIVERSITY ? CHART_LABELS.UNIVERSITY :
                        text == MAP_LAYER_PROPS.PROFESSIONAL ? CHART_LABELS.PROFESSIONAL :
                        text == MAP_LAYER_PROPS.POLYTECHNIC ? CHART_LABELS.POLYTECHNIC :
                        text == MAP_LAYER_PROPS.POST_SEC ? CHART_LABELS.POST_SEC :
                        text == MAP_LAYER_PROPS.SECONDARY ? CHART_LABELS.SECONDARY :
                        text == MAP_LAYER_PROPS.LOW_SEC ? CHART_LABELS.LOW_SECONDARY :
                        text == MAP_LAYER_PROPS.PRIMARY ? CHART_LABELS.PRIMARY :
                        CHART_LABELS.NONE;
                }
            }
        }
    };

    let litLabels = Object.keys(litData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL) && !k.startsWith(MAP_LAYER_PROPS.LIT));
    let litSeries = litLabels.map(k => {
        let val = litData[k];
        val = Array.isArray(val) ?
            val.map(o => UTIL.convertToNumber(o.value)).reduce((p, a) => a += p) :
            val;
        val = Math.round((val / litData[MAP_LAYER_PROPS.TOTAL]) * 100);
        return val;
    });
    let litOpt = {
        labels: litLabels.map(k => {
            return k == MAP_LAYER_PROPS.ONE_LANG ? CHART_LABELS.LIT_ONE :
                k == MAP_LAYER_PROPS.TWO_LANG ? CHART_LABELS.LIT_TWO :
                k == MAP_LAYER_PROPS.THREE_LANG ? CHART_LABELS.LIT_THREE :
                k;
        }),
        plotOptions: {
            radialBar: {
                dataLabels: {
                    total: {
                        formatter: (w) => litData[MAP_LAYER_PROPS.TOTAL]
                    }
                }
            }
        },
        series: litSeries
    };

    let occupationLabels = Object.keys(occupationData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let occupationOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: occupationLabels.map(k => occupationData[k])
        }],
        xaxis: {
            categories: occupationLabels.map(k => k.replace('1/', ''))
        }
    };

    let incomeLabels = Object.keys(incomeData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let incomeOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: incomeLabels.map(k => incomeData[k])
        }],
        xaxis: {
            categories: incomeLabels
        }
    };

    let transportLabels = Object.keys(transportData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let transportOpt = {
        series: [{
            name: CHART_LABELS.POPULATION,
            data: transportLabels.map(k => transportData[k])
        }],
        dataLabels: {
            enable: true,
            formatter: (val, op) => Math.round(val / transportData[MAP_LAYER_PROPS.TOTAL] * 100) + '%'
        },
        xaxis: {
            categories: transportLabels.map(k => k.replace('1/', '')),
        },
        yaxis: {
            labels: {
                formatter: (text) => {
                    return text == MAP_LAYER_PROPS.CAR ? CHART_LABELS.CAR :
                        text == MAP_LAYER_PROPS.LORRY_PICKUP ? CHART_LABELS.LORRY :
                        text == MAP_LAYER_PROPS.MRT_LRT_BUS ? CHART_LABELS.TRAIN_BUS :
                        text == MAP_LAYER_PROPS.MRT_LRT ? CHART_LABELS.TRAIN :
                        text == MAP_LAYER_PROPS.MOTORCYCLE_SCOOTER ? CHART_LABELS.MOTORCYCLE :
                        text == MAP_LAYER_PROPS.OTHER_MRT_LRT_BUS ? CHART_LABELS.TRAIN_BUS_OTHERS :
                        text == MAP_LAYER_PROPS.PRIVATE_BUS_VAN ? CHART_LABELS.PRIVATE_BUS :
                        text == MAP_LAYER_PROPS.PUBLIC_BUS ? CHART_LABELS.PUBLIC_BUS :
                        text == MAP_LAYER_PROPS.PRIVATE_HIRE_CAR ? CHART_LABELS.PRIVATE_HIRE_CAR :
                        text;
                }
            }
        }
    };

    let travelLabels = Object.keys(travelTimeData).filter(k => !k.includes(MAP_LAYER_PROPS.TOTAL));
    let travelOpt = {
        labels: travelLabels,
        series: travelLabels.map(k => travelTimeData[k]),
    };

    charts[ELEMENT_IDS.GEO_AGE_GROUP].updateOptions(ageGroupOpt);
    charts[ELEMENT_IDS.GEO_RACE].updateSeries([
        raceData[MAP_LAYER_PROPS.CHINESE],
        raceData[MAP_LAYER_PROPS.MALAYS],
        raceData[MAP_LAYER_PROPS.INDIANS],
        raceData[MAP_LAYER_PROPS.OTHERS]
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