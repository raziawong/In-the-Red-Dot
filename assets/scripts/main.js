function main() {

    function init() {
        initApexChartOptions();
        let map = initMap();

        window.addEventListener('DOMContentLoaded', async function() {
            initMenuInteractions();

            let populationSeries = await initPopulation();
            let years = populationSeries.ascYear.slice(-40);
            let yearData = populationSeries.dataByYear;

            doPopulationOverview(years, yearData);
            doPopulationTrend(years, yearData);

            doURAZoneAndData(map, await initGeoDistribution());
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
            colors: CHART_CONF.COLOR_RANGE,
            chart: {
                height: '100%',
                fontFamily: 'Nunito Sans,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif',
                redrawOnParentResize: true,
                redrawOnWindowResize: true,
                width: '100%',
                zoom: {
                    enabled: true
                }
            },
            dataLabels: {
                dropShadow: {
                    enabled: true,
                    left: 1,
                    top: 1,
                    opacity: 0.6
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
                    polygons: {
                        fill: ['#285943'],
                        strokeColors: '#7B9E89',
                        strokeWidth: 1.5
                    },
                    size: 140
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
                align: 'center',
                style: {
                    fontFamily: 'Montserrat,sans-serif'
                }
            },
            theme: {
                palette: 'palette8'
            },
            title: {
                align: 'center',
                offsetY: 12,
                style: {
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '1.1rem'
                }
            }
        };
    }

    function initMap() {
        let singapore = [1.3552, 103.7972];
        let bounds = L.latLng(1.3552, 103.7972).toBounds(28000);
        let map = L.map(ELEMENT_IDS.URA_ZONES_MAP, {
            dragging: false,
            zoomControl: false,
            trackResize: true,
            scrollWheelZoom: false,
            maxBounds: bounds,
            maxZoom: MAP_CONF.ZOOM_INITIAL + 2,
            minZoom: MAP_CONF.ZOOM_INITIAL - 3
        }).setView(singapore, MAP_CONF.ZOOM_INITIAL);

        map.fitBounds(bounds);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
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

    function initMenuInteractions() {
        function setActiveEleById(id) {
            document.getElementById(id).classList.add(ELEMENT_STATES.ACTIVE);
        }

        function closeMobileTreeNav() {
            document.getElementById(ELEMENT_IDS.SIDEBAR_CLOSE).click();
        }

        let treeNavEle = document.querySelector('.tree-nav-container');
        let treeItemEles = treeNavEle.querySelectorAll('li.menu-item a');
        let tabNavEle = document.querySelector('#plan-area .tab-container');
        let tabItemEles = tabNavEle.querySelectorAll('li');
        let tabCloseEles = document.querySelectorAll('#plan-area .tab-content-container .tab-close');

        for (let mi of treeItemEles) {
            mi.addEventListener('click', (evt) => {
                let sTargetId = mi.dataset.target;
                let activeSect = document.querySelector('section.active');
                let activeTab = document.querySelector('#plan-area .tab-content-container.active');
                if (activeSect) {
                    // hide currently active section
                    treeNavEle.querySelector('li.menu-item a.selected').classList.remove(ELEMENT_STATES.SELECTED);
                    activeSect.classList.remove(ELEMENT_STATES.ACTIVE);
                }
                mi.classList.add(ELEMENT_STATES.SELECTED);
                // set the section to be displayed
                setActiveEleById(sTargetId);
                // close the rest
                closeMobileTreeNav();
                // close active tab if section has it
                if (activeTab) {
                    activeTab.querySelector('.tab-close').click();
                }
            });
        }

        treeItemEles[0].click();

        for (let ti of tabItemEles) {
            ti.addEventListener('click', (evt) => {
                let activeSect = document.querySelector('section.active');

                // check if active section is plan area
                // and tab menu is not disabled
                if (activeSect &&
                    activeSect.id == ELEMENT_IDS.SECT_PLAN_AREA &&
                    !tabNavEle.classList.contains(ELEMENT_STATES.DISABLED)) {
                    let cTargetId = ti.dataset.target;
                    let selectedTab = tabNavEle.querySelector('li.selected');
                    // hide currently active tab
                    if (selectedTab) {
                        document.getElementById(selectedTab.dataset.target).classList.remove(ELEMENT_STATES.ACTIVE);
                        selectedTab.classList.remove(ELEMENT_STATES.SELECTED);
                    }
                    // set the tab item to be selected
                    ti.classList.add(ELEMENT_STATES.SELECTED);
                    // set the tab content to be displayed
                    setActiveEleById(cTargetId);
                }
            });
        }

        for (let tc of tabCloseEles) {
            tc.addEventListener('click', (evt) => {
                let container = tc.parentNode;
                if (container) {
                    let activeTab = document.querySelector(`[data-target="${container.id}"]`);
                    // hide selected tab item menu
                    if (activeTab.classList.contains(ELEMENT_STATES.SELECTED)) {
                        activeTab.classList.remove(ELEMENT_STATES.SELECTED);
                    }
                    // hide tab content
                    if (container.classList.contains(ELEMENT_STATES.ACTIVE)) {
                        container.classList.remove(ELEMENT_STATES.ACTIVE);
                    }
                }
            });
        }
    }

    init();
}

main();