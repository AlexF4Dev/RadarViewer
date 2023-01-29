function switchProduct (product) {
    const radar = map.getLayersOfType(RadarLayer);
    radar.setProduct(product.value)
    //console.log(product.value);
}

function setLoopIndex(slider) {
    const index = 4-slider.value;
    
    const radar = map.getLayersOfType(RadarLayer);
    const loopData = getLoopData();
    
    if(loopData[index]) {
        radar.setLoopIndex(index, radar.product);
    } else {
        ipcRenderer.send('loop');
        ipcRenderer.on('loop', (event, archives) => {
            archives.forEach(arch => {
                radar.uploadLoopData(arch);
            });
            radar.setLoopIndex(index, radar.product);
        })
    }
}

function getLoopData() {
    const radar = map.getLayersOfType(RadarLayer);
    if(radar.cachedLoopData.length == 0) {
        const data = ipcRenderer.sendSync('loopData');

        if(radar.cachedLoopData.length == 0) {
            console.log("Uploading Data!")
            for(var i = 0; i < data.length; i++) {
                radar.uploadLoopData(data[i]);
            }
        }
    }

    return radar.cachedLoopData;
}