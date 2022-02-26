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

            renderZoneAndData(map, await initGeoDistribution());
        });
    }

    function initApexChartOptions() {
        window.Apex = {
            animations: {
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                },
                enabled: true,
                easing: 'easeinout',
                speed: 800
            },
            chart: {
                height: '100%',
                fontFamily: 'Nunito Sans,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif',
                width: '100%',
                zoom: {
                    enabled: true
                }
            },
            legend: {
                horizontalAlign: 'center',
                position: 'bottom',
                show: true
            },
            markers: {
                style: 'hollow'
            },
            plotOptions: {
                radar: {
                    size: 150
                },
                treemap: {
                    distributed: true,
                    enableShades: false
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
                offsetY: 12,
                style: {
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '1.3rem'
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
            maxZoom: MAP.ZOOM_INITIAL + 4,
            minZoom: MAP.ZOOM_INITIAL - 1
        }).setView(singapore, MAP.ZOOM_INITIAL);

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