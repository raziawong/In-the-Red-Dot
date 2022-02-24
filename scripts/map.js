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

// function toggleMapView(map, viewLayers, value) {
//     let planAreaGroup = viewLayers.areas;
//     let subzoneGroup = viewLayers.subzones;

//     if (map.hasLayer(planAreaGroup)) {
//         map.removeLayer(planAreaGroup);
//     }

//     if (map.hasLayer(subzoneGroup)) {
//         map.removeLayer(planAreaGroup);
//     }

//     if (value === 'area') {
//         map.addLayer(planAreaGroup);
//     } else if (value === 'subzone') {
//         map.addLayer(subzoneGroup);
//     }
// }

function hoverLayer(event) {
    let layer = event.target;
    layer.setStyle({
        weight: 5,
        color: '#E73340',
        dashArray: ''
    });
    layer.openTooltip();
    layer.bringToFront();
}

function resetLayer(event) {
    let layer = event.target;
    layer.setStyle({
        weight: 2,
        color: 'grey',
        dashArray: '4'
    });
}

function clickLayer(event, map) {
    let layer = event.target;
    layer.setStyle({
        weight: 5,
        color: '#E73340',
        dashArray: ''
    });
    layer.openTooltip();
    layer.bringToFront();
    map.fitBounds(layer.getBounds());
}

function renderZoneAndData(map, geoDistriSeries) {
    let planAreaGroup = omnivore.kml(DATA_GOV_API.STORE_URL + '/2019_planarea.kml');
    planAreaGroup.on('ready', function() {
        map.fitBounds(planAreaGroup.getBounds());

        this.eachLayer(function(layer) {
            let properties = layer.feature.properties;
            let areaName = layer.feature.properties.PLN_AREA_N;

            for (let [type, data] of Object.entries(geoDistriSeries)) {
                for (let area in data) {
                    if (area.toLowerCase() == areaName.toLowerCase()) {
                        properties[type] = data[area];
                    }
                }
            }

            properties[MAP_PROP.POPULATION] = properties[MAP_PROP.AGE_GROUP][MAP_PROP.TOTAL] || properties[MAP_PROP.ETHNIC_GROUP][MAP_PROP.TOTAL];
            properties[MAP_PROP.DISPLAY_NAME] = areaName;

            layer.setStyle({
                fillColor: getHeatMapColor(geoDistriSeries.highestPopulationCount, properties['population']),
                weight: 2,
                opacity: 1,
                color: 'grey',
                dashArray: '4',
                fillOpacity: 0.7
            });

            layer.bindTooltip(layer.feature.properties[MAP_PROP.DISPLAY_NAME], {
                className: 'map-country-tooltip',
                permanent: false,
                direction: "center"
            });

            layer.on({
                mouseover: hoverLayer,
                mouseout: resetLayer,
                click: (e => clickLayer(e, map))
            });
        });
    }).addTo(map);

    let info = L.control({ position: 'bottomright' });
    info.onAdd = function(map) {
        let containerEle = L.DomUtil.create('div', 'info');
        let headerEle = L.DomUtil.create('h3', '', containerEle);
        let legendEle = L.DomUtil.create('div', 'legend', containerEle);

        containerEle.setAttribute('id', 'map-info');
        headerEle.innerHTML = '<h3>Population Density</h3>';

        legendEle.innerHTML = '<span>&nbsp;&nbsp;Low&nbsp;&nbsp;</span>';
        for (let color of MAP.COLOR_RANGE) {
            legendEle.innerHTML += '<i style="background:' + color + '"></i> ';
        }
        legendEle.innerHTML += '<span>&nbsp;&nbsp;High&nbsp;&nbsp;</span>';
        return containerEle;
    };
    info.addTo(map);

    // let viewLayers = {
    //     'areas': planAreaGroup,
    //     'subzones': subzoneGroup
    // }

    // toggleMapView(map, viewLayers, viewSelectEle.selectedOptions[0].value)
    // viewSelectEle.addEventListener('change', function(event) {
    //     toggleMapView(map, viewLayers, event.target.selectedOptions[0].value);
    // });
}