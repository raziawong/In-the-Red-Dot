function displayPieChart(type, elementId, seriesArray, labelArray) {
    const options = {
        chart: {
            type: type
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
            text: name,
            // offsetX: 30,
            // style: {
            //     fontSize: '24px',
            //     cssClass: 'apexcharts-yaxis-title'
            // }
        },
        subtitle: {
            text: subtitle,
            // offsetX: 30,
            // style: {
            //     fontSize: '14px',
            //     cssClass: 'apexcharts-yaxis-title'
            // }
        }
    };

    let chart = new ApexCharts(document.getElementById(id), options);
    chart.render();
}

function renderAnnualPopulationChart(populationData) {
    let years = populationData.ascYear.slice(-30);
    let yearData = populationData.dataByYear;
    let latestData = yearData[years[years.length - 1]];

    let optionsArea = {
        chart: {
            type: 'area',
            stacked: true,
            zoom: {
                enabled: true
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        stroke: {
            curve: 'smooth'
        },
        series: [{
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
        title: {
            text: 'Population Growth Insights'
        },
        markers: {
            size: 0,
            style: 'hollow',
            strokeWidth: 8,
            strokeColor: "#fff",
            strokeOpacity: 0.25,
        },
        labels: years,
        legend: {
            position: 'top',
            horizontalAlign: 'right'
        }
    }

    let chart = new ApexCharts(document.getElementById("increase-trend"), optionsArea);
    chart.render();

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