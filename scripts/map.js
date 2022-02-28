function getHeatMapColor(highestNum, num) {
    let percentage = (highestNum - num) / highestNum * 100;
    return percentage > 90 ? MAP.COLOR_RANGE[0] :
        percentage > 80 ? MAP.COLOR_RANGE[1] :
        percentage > 70 ? MAP.COLOR_RANGE[2] :
        percentage > 50 ? MAP.COLOR_RANGE[3] :
        percentage > 40 ? MAP.COLOR_RANGE[4] :
        percentage > 30 ? MAP.COLOR_RANGE[5] :
        percentage > 20 ? MAP.COLOR_RANGE[6] :
        percentage > 10 ? MAP.COLOR_RANGE[7] :
        MAP.COLOR_RANGE[8];
}


function renderZoneAndData(map, geoDistrData) {
    function hoverLayer(event) {
        let layer = event.target;
        layer.setStyle({
            weight: 5,
            color: MAP.HOVER_BORDER_COLOR,
            dashArray: ''
        });
        layer.openTooltip();
        layer.bringToFront();
    }

    function resetLayer(event) {
        let layer = event.target;
        if (layer.options.color && layer.options.color !== MAP.CLICK_BORDER_COLOR) {
            layer.setStyle({
                weight: 2,
                color: MAP.DEFAULT_BORDER_COLOR,
                dashArray: '4'
            });
        }
    }

    function clickLayer(event, map, geoCharts, prevClickLayer) {
        let layer = event.target;
        let properties = layer.feature.properties;

        console.log(prevClickLayer);
        if (prevClickLayer) {
            prevClickLayer.setStyle({
                weight: 2,
                color: MAP.DEFAULT_BORDER_COLOR,
                dashArray: '4'
            });
        }

        layer.setStyle({
            weight: 5,
            color: MAP.CLICK_BORDER_COLOR,
            dashArray: ''
        });

        map.fitBounds(layer.getBounds());

        let subtext = properties[MAP_LAYER_PROPS.POPULATION] || 'No Data';
        let container = document.getElementById(ELEMENT_IDS.MAP_AREA_INFO);
        container.innerHTML = `<p>Click on plan area to see population number</p>
        <h5>${properties[MAP_LAYER_PROPS.DISPLAY_NAME]}</h5>
        <p>Population: <span>${subtext}</span></p>`;
        container.style.display = 'initial';

        updateGeoDistrCharts(geoCharts, properties);

        return layer;
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
                color: MAP.DEFAULT_BORDER_COLOR,
                dashArray: '4',
                fillOpacity: 0.7
            });

            layer.bindTooltip(`<p>${properties[MAP_LAYER_PROPS.DISPLAY_NAME]}</p>`, {
                className: 'map-country-tooltip',
                permanent: false,
                direction: 'center'
            });

            let prevClickLayer = null;
            layer.on({
                mouseover: hoverLayer,
                mouseout: resetLayer,
                click: (e => { prevClickLayer = clickLayer(e, map, geoCharts, prevClickLayer) })
            });
        });
    }).addTo(map);

    let info = L.control({ position: 'bottomright' });
    info.onAdd = function(map) {
        let containerEle = L.DomUtil.create('div', 'info');
        let areaContainerEle = L.DomUtil.create('div');
        let headerEle = L.DomUtil.create('h6', '', containerEle);
        let legendEle = L.DomUtil.create('div', 'legend', containerEle);

        containerEle.setAttribute('id', ELEMENT_IDS.MAP_INFO);
        headerEle.innerText = 'Population Density';

        legendEle.innerHTML = '<span>&nbsp;&nbsp;Low&nbsp;&nbsp;</span>';
        for (let color of MAP.COLOR_RANGE) {
            legendEle.innerHTML += '<i style="background:' + color + '"></i> ';
        }
        legendEle.innerHTML += '<span>&nbsp;&nbsp;High&nbsp;&nbsp;</span>';

        areaContainerEle.setAttribute('id', ELEMENT_IDS.MAP_AREA_INFO);
        areaContainerEle.innerHTML = '<p>Click on plan area to see population number</p>';
        containerEle.prepend(areaContainerEle);

        return containerEle;
    };
    info.addTo(map);
}