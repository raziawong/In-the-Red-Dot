const MAP_ZOOM_INITIAL = 12.4;

function main() {

    function init() {
        initApexChart();
        let map = initMap();


        window.addEventListener('DOMContentLoaded', async function() {
            let populationSeries = await initPopulation();
            renderAnnualPopulationChart(populationSeries);

            let geoDistriSeries = await initGeoDistribution();
            renderZoneAndData(map, geoDistriSeries);
        });
    }

    function initApexChart() {
        window.Apex = {
            chart: {
                height: '100%'
            },
            theme: {
                palette: 'palette6'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.9,
                    opacityTo: 0.6
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
            },
            title: {
                style: {
                    fontFamily: 'Montserrat,sans-serif'
                }
            },
            subtitle: {
                style: {
                    fontFamily: 'Montserrat,sans-serif'
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

    async function initCensus() {
        let rawData = await getAllCensusData();
        let censusSeries = transformCensusData(rawData);
        return censusSeries;
    }

    init();
}

main();