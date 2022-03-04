function getHeatMapColor(highestNum, num) {
    let percentage = (highestNum - num) / highestNum * 100;
    return percentage > 90 ? MAP_CONF.COLOR_RANGE[0] :
        percentage > 80 ? MAP_CONF.COLOR_RANGE[1] :
        percentage > 70 ? MAP_CONF.COLOR_RANGE[2] :
        percentage > 50 ? MAP_CONF.COLOR_RANGE[3] :
        percentage > 40 ? MAP_CONF.COLOR_RANGE[4] :
        percentage > 30 ? MAP_CONF.COLOR_RANGE[5] :
        percentage > 20 ? MAP_CONF.COLOR_RANGE[6] :
        percentage > 10 ? MAP_CONF.COLOR_RANGE[7] :
        MAP_CONF.COLOR_RANGE[8];
}

function doURAZoneAndData(map, geoDistrData) {
    function hoverLayer(evt) {
        let layer = evt.target;
        layer.setStyle({
            weight: 5,
            color: MAP_CONF.HOVER_BORDER_COLOR,
            dashArray: ''
        });
        layer.openTooltip();
        layer.bringToFront();
    }

    function resetLayer(evt) {
        let layer = evt.target;
        if (layer.options.color && layer.options.color !== MAP_CONF.CLICK_BORDER_COLOR) {
            layer.setStyle({
                weight: 2,
                color: MAP_CONF.DEFAULT_BORDER_COLOR,
                dashArray: '4'
            });
        }
    }

    function clickLayer(evt, map, geoCharts) {
        let layer = evt.target;
        let properties = layer.feature.properties;
        let subtext = properties[MAP_LAYER_PROPS.POPULATION] || 'No Data';
        let container = document.getElementById(ELEMENT_IDS.MAP_AREA_INFO);
        let tabNavItemEle = document.querySelectorAll('#plan-area .tab-container li');

        container.innerHTML = `<h5>${properties[MAP_LAYER_PROPS.DISPLAY_NAME]}</h5>
        <p>Population: <span>${subtext}</span></p>`;

        map.fitBounds(layer.getBounds());

        for (let ti of tabNavItemEle) {
            if (subtext == 'No Data') {
                ti.classList.add(ELEMENT_STATES.DISABLED);
            } else {
                ti.classList.remove(ELEMENT_STATES.DISABLED);
                updateGeoDistrCharts(geoCharts, properties);
            }
        }
    }

    let planAreaGroup = omnivore.kml(DATA_GOV_API.STORE_URL + '/2019_planarea.kml');
    let geoCharts = getGeoDistrCharts();

    planAreaGroup.on('ready', function() {
        map.fitBounds(planAreaGroup.getBounds());

        this.eachLayer(function(layer) {
            let properties = layer.feature.properties;
            let areaName = layer.feature.properties.PLN_AREA_N;

            for (let [type, data] of Object.entries(geoDistrData)) {
                for (let area in data) {
                    if (area.toLowerCase() == areaName.toLowerCase()) {
                        properties[type] = data[area];
                    }
                }
            }

            properties[MAP_LAYER_PROPS.POPULATION] = properties[MAP_LAYER_PROPS.GENDER_POP][MAP_LAYER_PROPS.TOTAL] || 0;
            properties[MAP_LAYER_PROPS.DISPLAY_NAME] = areaName;

            layer.setStyle({
                fillColor: getHeatMapColor(geoDistrData.highestPopulationCount, properties[MAP_LAYER_PROPS.POPULATION]),
                weight: 2,
                opacity: 1,
                color: MAP_CONF.DEFAULT_BORDER_COLOR,
                dashArray: '4',
                fillOpacity: 0.7
            });

            layer.bindTooltip(`<p>${properties[MAP_LAYER_PROPS.DISPLAY_NAME]}</p>`, {
                className: 'map-country-tooltip',
                permanent: false,
                direction: 'center'
            });

            layer.on({
                mouseover: hoverLayer,
                mouseout: resetLayer,
                click: (e => clickLayer(e, map, geoCharts))
            });
        });
    }).addTo(map);

    let info = L.control({ position: 'topleft' });
    info.onAdd = function(map) {
        let containerEle = L.DomUtil.create('div', 'info');
        let areaContainerEle = L.DomUtil.create('div');
        let legendEle = L.DomUtil.create('div', 'legend', containerEle);
        let legTitleEle = L.DomUtil.create('div', 'subtitle', containerEle);

        containerEle.id = ELEMENT_IDS.MAP_INFO;
        legTitleEle.innerText = 'Population Density';

        legendEle.innerHTML = '<span>&nbsp;&nbsp;Low&nbsp;&nbsp;</span>';
        for (let color of MAP_CONF.COLOR_RANGE) {
            legendEle.innerHTML += '<i style="background:' + color + '"></i> ';
        }
        legendEle.innerHTML += '<span>&nbsp;&nbsp;High&nbsp;&nbsp;</span>';

        areaContainerEle.id = ELEMENT_IDS.MAP_AREA_INFO;
        areaContainerEle.innerHTML = '<p>Click on plan area to see population number</p>';
        containerEle.prepend(areaContainerEle);

        return containerEle;
    };
    info.addTo(map);
}