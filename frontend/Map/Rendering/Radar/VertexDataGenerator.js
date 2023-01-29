class VertexDataGenerator {
    /**
     * 
     * @param {Level2Archive} archive 
     * @param {Colormap} colormap 
     */
    static generateData(archive, dataMomentType, colormap) {
            var verts= [];

            //print("Verts!");
            var sweepIndex = 0;
            if (dataMomentType == "VEL") {
                sweepIndex = 1;
            }
        
            archive.volume.sweeps[sweepIndex].rays.forEach(ray => {
                var dataMomentIndex = 0;
                for (var i = 0; i<ray.dataMoments.length; i++) {
                    if (ray.dataMoments[i].dataMomentName == dataMomentType) {
                        dataMomentIndex = i;
                    }
                }
                for(var gateIndex = 0; gateIndex < ray.dataMoments[dataMomentIndex].dataMoments.length-500; gateIndex++) {
                        let gateValue = ray.dataMoments[dataMomentIndex].dataMoments[gateIndex];
                        if (gateValue != -99) {
                            let azimuth = 360 - ray.dataMoments[dataMomentIndex].azimuth;
                            let rayWidth = archive.volume.sweeps[sweepIndex].rays.length == 360 ? 1 : 0.5;
                            let gateSize = ray.dataMoments[dataMomentIndex].dataMomentRangeSampleInterval * 1000;
                            let dataCollectionStartDistance = ray.dataMoments[dataMomentIndex].dataMomentRange * 1000;
                            
                            
                            
                            //Bottom Right
                            /*let p1 = Utils.toImageCoords(coord: Utils.antennaToCartesian(azimuth: (azimuth + Float((rayWidth / 2))) + 0.1, range: dataCollectionStartDistance + (gateSize * Float(gateIndex))));
                            //Bottom Left
                            let p2 = Utils.toImageCoords(coord: Utils.antennaToCartesian(azimuth: (azimuth - Float((rayWidth / 2))), range: dataCollectionStartDistance + (gateSize * Float(gateIndex))));
                            //Top Left
                            let p3 = Utils.toImageCoords(coord: Utils.antennaToCartesian(azimuth: (azimuth - Float((rayWidth / 2))), range: dataCollectionStartDistance + (gateSize * (Float(gateIndex) + 1))));
                            //Top Right
                            let p4 = Utils.toImageCoords(coord: Utils.antennaToCartesian(azimuth: (azimuth + Float((rayWidth / 2))) + 0.1, range: dataCollectionStartDistance + (gateSize * (Float(gateIndex) + 1))));*/
                            
                            var p1 = CRS.cartesianToGeographic(CRS.antennaToCartesian((azimuth + ((rayWidth / 2))) + 0.1, dataCollectionStartDistance + (gateSize * (gateIndex))),{lat: archive.latitude, lon: archive.longitude});
                            var p2 = CRS.cartesianToGeographic(CRS.antennaToCartesian((azimuth - ((rayWidth / 2))),  dataCollectionStartDistance + (gateSize * (gateIndex))), {lat: archive.latitude, lon: archive.longitude});
                            //Top Left
                            var p3 = CRS.cartesianToGeographic(CRS.antennaToCartesian((azimuth - ((rayWidth / 2))), dataCollectionStartDistance + (gateSize * ((gateIndex) + 1))), {lat: archive.latitude, lon: archive.longitude});
                            //Top Right
                            var p4 = CRS.cartesianToGeographic(CRS.antennaToCartesian((azimuth + ((rayWidth / 2))) + 0.1, dataCollectionStartDistance + (gateSize * ((gateIndex) + 1))), {lat: archive.latitude, lon: archive.longitude});
                            /*verts.append(p1);
                            verts.append(p4);
                            verts.append(p3);
                            verts.append(p3);
                            verts.append(p2);
                            verts.append(p1);*/
                            
                            /*print("-----")
                            print(geographicToPixel(p1))
                            print(geographicToPixel(p4))
                            print(geographicToPixel(p3))
                            print("-----")*/
                            const color = colormap.getColorForValue(gateValue);
                            p1 = CRS.geographicToPixel(p1)
                            p4 = CRS.geographicToPixel(p4)
                            p3 = CRS.geographicToPixel(p3)
                            p2 = CRS.geographicToPixel(p2)

                            var points = [p1, p4, p3, p3, p2, p1]
                            //1,4,3,3,2,1
                            points.forEach(point => {
                                verts.push(point.x)
                                verts.push(point.y)
                                //verts.push(0)
                                verts.push(color[0])
                                verts.push(color[1])
                                verts.push(color[2])
                                verts.push(1)
                            })
                        }
                    }
            })
            
            return verts
    }
}