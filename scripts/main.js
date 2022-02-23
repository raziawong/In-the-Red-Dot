const MAP_ZOOM_INITIAL = 12.4;

function main() {

    function init() {
        initApexChartOptions();
        let map = initMap();

        window.addEventListener('DOMContentLoaded', async function() {
            let populationSeries = await initPopulation();
            let years = populationSeries.ascYear.slice(-10);
            let yearData = populationSeries.dataByYear;
            doPopulationOverview(years, yearData);
            doPopulationTrendData(years, yearData);

            let geoDistriSeries = await initGeoDistribution();
            renderZoneAndData(map, geoDistriSeries);
        });
    }

    function initApexChartOptions() {
        window.Apex = {
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            },
            chart: {
                height: '100%',
                width: '100%',
                zoom: {
                    enabled: true
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    inverseColors: false,
                    shade: 'dark',
                    type: "vertical",
                    opacityFrom: 1,
                    opacityTo: 0.7
                }
            },
            legend: {
                show: true,
                position: 'top',
                horizontalAlign: 'right'
            },
            markers: {
                size: 0,
                style: 'hollow',
                strokeWidth: 8,
                strokeColor: "#fff",
                strokeOpacity: 0.25,
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
                    },
                    columnWidth: '75%'
                },
                line: {
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            stroke: {
                curve: 'smooth'
            },
            subtitle: {
                style: {
                    fontFamily: 'Montserrat,sans-serif'
                }
            },
            theme: {
                palette: 'palette8'
            },
            title: {
                style: {
                    fontFamily: 'Montserrat,sans-serif'
                }
            },
            xaxis: {
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            }
        };
    }

    function initMap() {
        let singapore = [1.3552, 103.7972];
        //let bounds = L.latLng(1.3552, 103.7972).toBounds(28000);
        let map = L.map('ura-zones-map', {
            dragging: false,
            zoomControl: false,
            maxZoom: MAP_ZOOM_INITIAL + 4,
            minZoom: MAP_ZOOM_INITIAL - 1
        }).setView(singapore, MAP_ZOOM_INITIAL);

        //map.fitBounds(bounds);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/light-v10',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZXh0cmFrdW4iLCJhIjoiY2swdnZtMWVvMTAxaDNtcDVmOHp2c2lxbSJ9.4WxdONppGpMXeHO6rq5xvg'
        }).addTo(map);

        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        map.options.zoomControl = true;

        return map;
    }

    async function initGeoDistribution() {
        let rawData = await getGeoDistributionData();
        let populationSeries = transformGeoDistributionData(rawData);
        return populationSeries;
    }

    async function initPopulation() {
        let rawData = await getAnnualPopulationData();
        let populationSeries = transformAnnualPopulationData(rawData);
        return populationSeries;
    }

    init();
}

main();