const { ipcRenderer } = require('electron')

const map = new Map(document.querySelector(".map"), {lat: 39.2673, lon: 76.7983});

ipcRenderer.send('archive', 'KLWX');

ipcRenderer.on('archive', (event, archive) => {
    map.addLayer(new RadarLayer(archive, "REF"))
    updateInterface(archive)

    fetch("res/Counties.json").then(res => res.json()).then(json => {
        //console.log(json.features.length)
        map.addLayer(new GeoJSONLayer(json, 1, [1,1,1], .2))
    })
    fetch("res/States.json").then(res => res.json()).then(json => {
        //console.log(json.features.length)
        map.addLayer(new GeoJSONLayer(json, 5, [1,1,1], 0))
    })
    fetch('https://api.weather.gov/alerts/active?event=Severe%20Thunderstorm%20Warning').then(res => res.json()).then(json => {
        map.addLayer(new GeoJSONLayer(json, 11, [0, 0, 0], 0));
        map.addLayer(new GeoJSONLayer(json, 4, [245/255, 188/255, 66/255], 0));
    })

    fetch('https://api.weather.gov/alerts/active?event=Tornado%20Warning').then(res => res.json()).then(json => {
        map.addLayer(new GeoJSONLayer(json, 11, [0, 0, 0], 0));
        map.addLayer(new GeoJSONLayer(json, 4, [1, 0, 0], 0));
    })
})

ipcRenderer.on('newData', (event, archive) => {
    const radar = map.getLayersOfType(RadarLayer);
    radar.updateData(archive);
    updateInterface(archive);
})


/**
 * 
 * @param {Level2Archive} arch 
 */
function updateInterface(arch) {
    const stationName = document.querySelector('.sidebar-station');
    const date = document.querySelector('.sidebar-date');
    const vcp = document.querySelector('.sidebar-vcp');

    stationName.innerHTML = arch.radarStationName;
    date.innerHTML = `${arch.formattedDate}`;
    vcp.innerHTML = `VCP ${arch.vcp}`;
}