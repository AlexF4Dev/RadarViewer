const fs = require('fs');
const { BinaryFile } = require('./BinaryFile.js')
const { GenericDataMoment, ElevationDataConstantType, RadialDataConstantType, VolumeDataConstantType } = require('./RadialData.js')
const { MessageHeader, Message31Header, Message2Header } = require("./Types.js")
const { Volume } = require("./Volume");
const { Ray } = require("./Ray");
const { Sweep } = require("./Sweep");


class Level2Archive {
    constructor(path) {
        if(path) {
            console.time("Decode Timer");
            this.volume = this.decode(path);
            this.file = null;
            console.timeEnd("Decode Timer");
        }
    }
    getScanDate() {
        return this.formattedDate;
    }

    getStationName() {
        return this.radarStationName;
    }

    getStationLatLon() {
        return this.stationLatLon;
    }

    decode(path) {
        this.file = new BinaryFile(BinaryFile.decodeFile(path));

        // Volume Header:
        this.file.readString(9);
        this.file.readString(3);

        const scanDay = this.file.readInteger(4);
        const scanTime = this.file.readInteger(4);
        this.formattedDate = BinaryFile.formatDate(scanDay, scanTime);

        this.radarStationName = this.file.readString(4);
        //Skipping Metadata
        this.file.skip(134 * 2432);
        var sweeps = []
        for (var sweepIndex = 0; sweepIndex < 2; sweepIndex++) {
            var sweep = new Sweep();
            for (var i = 0; i < 720; i++) {
                this.file.skip(12) // Skip Legacy CTM Header
                const messageHeader = new MessageHeader(this.file);
                switch (messageHeader.messageType) {
                    case 31:
                        const message31 = new Message31Header(this.file);

                        if(sweep.elevation == 0) {
                            sweep.elevation = message31.elevationNumber;
                        }

                        var datamoments = []
                        
                        const volume = new VolumeDataConstantType(this.file, message31.initPosition + message31.volumeDCTpointer);

                        if(this.stationLatLon == null) {
                            this.stationLatLon = {lat: volume.lat, lon: volume.long};
                            this.latitude = volume.lat;
                            this.longitude = volume.long;
                        }
                        if(this.vcp == null) {
                            this.vcp = volume.volumeCoveragePatternNumber;
                        }

                        const elevation = new ElevationDataConstantType(this.file, message31.initPosition + message31.elevationDCTpointer);
                        const radial = new RadialDataConstantType(this.file, message31.initPosition + message31.radialDCTpointer);

                        for (var j = 0; j < message31.dataBlockCount - 3; j++) {
                            datamoments.push(new GenericDataMoment(this.file, message31.initPosition + message31.dataBlockPointers[j], message31.azimuthAngle));
                        }
                        sweep.rays.push(new Ray(datamoments))
                        //console.log(`Ray ${message31.azimuthNumber} has block count ${message31.dataBlockCount} and zdr number ${message31.zdrPointer}`);
                        break;

                    case 2:
                        const message2 = new Message2Header(this.file);
                        this.file.skip(2432 - 16 - 54 - 12);
                        console.log("Message 2!")
                        break;

                    default:
                        console.log("Not Message 31!")
                        this.file.skip(messageHeader.messageBlockSize)
                        break;
                }
            }
            sweeps.push(sweep);
        }
        const volume = new Volume(sweeps);

        return volume;
    }

    fromBuffer(buf) {
        this.file = BinaryFile.fromBuffer(buf);

        // Volume Header:
        this.file.readString(9);
        this.file.readString(3);

        const scanDay = this.file.readInteger(4);
        const scanTime = this.file.readInteger(4);
        this.formattedDate = BinaryFile.formatDate(scanDay, scanTime);

        this.radarStationName = this.file.readString(4);
        //Skipping Metadata
        this.file.skip(134 * 2432);
        var sweeps = []
        for (var sweepIndex = 0; sweepIndex < 2; sweepIndex++) {
            var sweep = new Sweep();
            for (var i = 0; i < 720; i++) {
                this.file.skip(12) // Skip Legacy CTM Header
                const messageHeader = new MessageHeader(this.file);
                switch (messageHeader.messageType) {
                    case 31:
                        const message31 = new Message31Header(this.file);

                        if(sweep.elevation == 0) {
                            sweep.elevation = message31.elevationNumber;
                        }

                        var datamoments = []
                        
                        const volume = new VolumeDataConstantType(this.file, message31.initPosition + message31.volumeDCTpointer);

                        if(this.stationLatLon == null) {
                            this.stationLatLon = {lat: volume.lat, lon: volume.long};
                            this.latitude = volume.lat;
                            this.longitude = volume.long;
                        }
                        if(this.vcp == null) {
                            this.vcp = volume.volumeCoveragePatternNumber;
                        }

                        const elevation = new ElevationDataConstantType(this.file, message31.initPosition + message31.elevationDCTpointer);
                        const radial = new RadialDataConstantType(this.file, message31.initPosition + message31.radialDCTpointer);

                        for (var j = 0; j < message31.dataBlockCount - 3; j++) {
                            datamoments.push(new GenericDataMoment(this.file, message31.initPosition + message31.dataBlockPointers[j], message31.azimuthAngle));
                        }
                        sweep.rays.push(new Ray(datamoments))
                        //console.log(`Ray ${message31.azimuthNumber} has block count ${message31.dataBlockCount} and zdr number ${message31.zdrPointer}`);
                        break;

                    case 2:
                        const message2 = new Message2Header(this.file);
                        this.file.skip(2432 - 16 - 54 - 12);
                        console.log("Message 2!")
                        break;

                    default:
                        console.log("Not Message 31!")
                        this.file.skip(messageHeader.messageBlockSize)
                        break;
                }
            }
            sweeps.push(sweep);
        }
        const volume = new Volume(sweeps);
        this.volume = volume
        return this;
    }
}

exports.Level2Archive = Level2Archive;

/*console.time("Decode Timer");
        this.file = new BinaryFile(BinaryFile.decodeFile(path));

        // Volume Header:
        this.file.readString(9);
        this.file.readString(3);

        const scanDay = this.file.readInteger(4);
        const scanTime = this.file.readInteger(4);
        this.formattedDate = BinaryFile.formatDate(scanDay, scanTime);

        this.radarStationName = this.file.readString(4);

        console.log("Radar Station Name: " + this.radarStationName);
        console.log("Scan Time: " + this.formattedDate);

        //Skipping Metadata
        this.file.skip(134 * 2432);
        // Skip Legacy CTM Header
        this.file.skip(12);
        //Skip Message Header
        this.file.skip(16);

        this.initPosition = this.file.getPosition();

        // Message 31 Start:
        this.file.readString(4); // 0-3

        const collectionTime = this.file.readInteger(4); // 4-7
        const collectionDate = this.file.readInteger(2); // 8-9
        const azimuthNumber = this.file.readInteger(2); // 10-11
        this.azimuthAngle = this.file.readReal(4); // 12-15

        const compressionIndicator = this.file.readCode(1); // 16
        this.file.skip(1); // 17 Spare
        const radialLength = this.file.readInteger(2); // 18-19
        const azimuthResolutionSpacing = this.file.readCode(1); // 20

        const radialStatus = this.file.readCode(1); // 21
        const elevationNumber = this.file.readInteger(1); // 22
        const cutSectorNumber = this.file.readInteger(1); // 23
        const elevationAngle = this.file.readReal(4); // 24-27
        //console.log("Elevation Angle: " + elevationAngle)
        const radialSpotBlankingStatus = this.file.readCode(1); // 28
        const azimuthIndexingMode = this.file.readScaledInteger(1, 0.01); // 29
        const dataBlockCount = this.file.readInteger(2); // 30-31
        //console.log("Data Block Count: " + dataBlockCount)
        const positionBeforePointer = this.file.getPosition();
        const currentPos = this.file.getPosition();
        this.volumeDCTpointer = this.file.readInteger(4); // 32-35
        //const volPosition = bin.getPosition() + volumeDCTpointer;
        this.elevationDCTpointer = this.file.readInteger(4); // 36-39
        this.radialDCTpointer = this.file.readInteger(4); // 40-43
        this.refPointer = this.file.readInteger(4); // 44-47
        this.velPointer = this.file.readInteger(4); // 48-51
        this.swPointer = this.file.readInteger(4); // 52 - 55
        this.zdrPointer = this.file.readInteger(4); // 56 - 59
        const phiPointer = this.file.readInteger(4); // 60 - 63
        const rhoPointer = this.file.readInteger(4); // 64 - 67

        //Reading in all datablocks to reach end of message
        const volume = new VolumeDataConstantType(this.file, this.initPosition + this.volumeDCTpointer);
        const elevation = new ElevationDataConstantType(this.file, this.initPosition + this.elevationDCTpointer);
        const radial = new RadialDataConstantType(this.file, this.initPosition + this.radialDCTpointer);
        const ref = new GenericDataMoment(this.file, this.initPosition + this.refPointer);
        const vel = new GenericDataMoment(this.file, this.initPosition + this.velPointer);
        const sw = new GenericDataMoment(this.file, this.initPosition + this.swPointer);
        const zdr = new GenericDataMoment(this.file, this.initPosition + this.zdrPointer);

        console.log(this.volumeDCTpointer)
        console.log(this.radialDCTpointer)
        console.log(this.refPointer)
        console.log(this.velPointer)
        console.log(this.swPointer)
        console.log(this.zdrPointer)
        console.log(phiPointer)
        console.log(rhoPointer)
        //Skip Legacy CTM
        this.file.skip(12)

        //Parse next message header
        this.parseMessageHeader();

        console.log(this.file.readString(4));

        this.radialResolution = (azimuthResolutionSpacing == 1) ? 0.5 : 1;
        this.gateSize = 250;
        this.refData = { stationName: this.radarStationName, scanDate: this.formattedDate, azimuthalResolutionDegrees: this.radialResolution, gateSizeMeters: this.gateSize, rays: [] }
        this.numRays = 360 / this.radialResolution;
        console.timeEnd("Decode Timer")*/