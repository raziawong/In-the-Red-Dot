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

            let geoDistrSeries = await initGeoDistribution();
            doPlanAreaMapAndData(map, geoDistrSeries);
            initPlanAreaCompareForm(geoDistrSeries, initComparisonCharts());
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
                bubble: {
                    minBubbleRadius: 7,
                    maxBubbleRadius: 50
                },
                radar: {
                    polygons: {
                        fill: ['#285943'],
                        strokeColors: '#7B9E89',
                        strokeWidth: 1.5
                    },
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
            theme: {
                palette: 'palette8'
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
        let paTabNavEle = document.querySelector('#plan-area .tab-container');
        let tabItemEles = paTabNavEle.querySelectorAll('li');
        let transNegEles = document.querySelectorAll('section .trans-content .trans-head');

        for (let mi of treeItemEles) {
            mi.addEventListener('click', (evt) => {
                let sTargetId = mi.dataset.target;
                let activeSect = document.querySelector('section.active');
                let activeTab = document.querySelector('#plan-area .trans-content.active');
                let activeModal = document.querySelector('#compare-areas .trans-content.active');

                if (activeSect) {
                    // hide currently active section
                    treeNavEle.querySelector('li.menu-item a.selected').classList.remove(ELEMENT_STATES.SELECTED);
                    activeSect.classList.remove(ELEMENT_STATES.ACTIVE);
                }
                mi.classList.add(ELEMENT_STATES.SELECTED);
                // set the section to be displayed
                setActiveEleById(sTargetId);
                // close the tree nav
                closeMobileTreeNav();

                // close active tab if section has it
                if (activeTab) {
                    activeTab.querySelector('.trans-head').click();
                } else if (activeModal) {
                    activeModal.querySelector('.trans-head').click();
                }
            });
        }

        treeItemEles[0].click();

        for (let ti of tabItemEles) {
            ti.addEventListener('click', (evt) => {
                let activeSect = document.querySelector('section.active');

                // check if active section is plan area
                // and tab menu is not disabled
                if (activeSect && activeSect.id == ELEMENT_IDS.SECT_PLAN_AREA &&
                    !ti.classList.contains(ELEMENT_STATES.DISABLED)) {
                    let cTargetId = ti.dataset.target;
                    let selectedTab = paTabNavEle.querySelector('li.selected');
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

        for (let tn of transNegEles) {
            tn.addEventListener('click', (evt) => {
                let container = tn.parentNode;
                if (container) {
                    let activeTab = document.querySelector(`[data-target="${container.id}"]`);

                    // if triggered by tab menu, remove selection on tab menu item
                    if (activeTab && activeTab.classList.contains(ELEMENT_STATES.SELECTED)) {
                        activeTab.classList.remove(ELEMENT_STATES.SELECTED);
                    }

                    // hide transformed content
                    if (container.classList.contains(ELEMENT_STATES.ACTIVE)) {
                        container.classList.remove(ELEMENT_STATES.ACTIVE);
                    }
                }
            });
        }
    }

    function initPlanAreaCompareForm(geoDistrData, charts) {
        let planAreaOpts = [];
        let planAreas = [];
        let dataSOF = geoDistrData[GD_DATA_KEYS.GENDER_POP];
        let compareForm = document.getElementById(ELEMENT_IDS.COMPARE_FORM);
        let planAreasSel = document.getElementById(ELEMENT_IDS.PLAN_AREAS_SEL);

        for (let [area, data] of Object.entries(dataSOF)) {
            if (area !== GD_DATA_KEYS.TOTAL && data.hasOwnProperty(GD_DATA_KEYS.TOTAL) && data[GD_DATA_KEYS.TOTAL]) {
                planAreaOpts.push({ html: area, value: UTIL.convertDOSKeys(area) });
                planAreas.push(area);
            }
        }

        for (let opt of planAreaOpts) {
            let optEle = document.createElement('option');
            optEle.value = opt.value;
            optEle.innerText = opt.html;
            planAreasSel.appendChild(optEle);
        }

        let planAreaDrop = new drop({
            options: planAreaOpts,
            selector: '#' + ELEMENT_IDS.PLAN_AREAS_SEL
        });

        compareForm.querySelector('input[type="submit"]').addEventListener('click', evt => {
            let planAreaInput = planAreaDrop.options.filter(opt => opt.selected);
            let planAreaErrEle = compareForm.querySelectorAll('.validation span')[0];
            let catInput = compareForm.querySelector('input[name="category"]:checked');
            let catErrEle = compareForm.querySelectorAll('.validation span')[1];
            let hasErr = false;

            planAreaErrEle.style.display = 'none';
            catErrEle.style.display = 'none';

            if (planAreaInput.length < 2) {
                planAreaErrEle.innerText = ERROR_MSG.PLAN_AREAS_2;
                planAreaErrEle.style.display = 'initial';
                hasErr = true;
            } else if (planAreaInput.length > 5) {
                planAreaErrEle.innerText = ERROR_MSG.PLAN_AREAS_5;
                planAreaErrEle.style.display = 'initial';
                hasErr = true;
            }
            if (!catInput) {
                catErrEle.innerText = ERROR_MSG.CAT_REQUIRED;
                catErrEle.style.display = 'initial';
                hasErr = true;
            }

            if (!hasErr) {
                let category = catInput.value;
                let planAreasList = planAreaInput.map(opt => opt.html);
                updateComparisonCharts(category, planAreasList, geoDistrData, charts[category]);

                let transEle = document.getElementById(catInput.dataset.target);
                if (transEle) {
                    transEle.classList.add(ELEMENT_STATES.ACTIVE);
                }
            }
        });

    }

    init();
}

main();