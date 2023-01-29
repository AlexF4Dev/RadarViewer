class MessageHeader {
    constructor(file) {
        //Documentation: https://www.roc.noaa.gov/wsr88d/PublicDocs/ICDs/2620002R.pdf, Pg 17
        this.messageBlockSize = file.readInteger(2)// 0 - 1
        this.rdaRedundantChannel =  file.readInteger(1); // 2
        this.messageType = file.readInteger(1); // 3
        this.idSequenceNumber = file.readInteger(2); //4-5
        this.julianDate = file.readInteger(2); //6-7
        this.millisecondsOfDay = file.readInteger(4); //8-11
        this.numberOfSegments = file.readInteger(2); // 12 - 13
        this.messageSegmentNumber = file.readInteger(2); // 14 - 15
    }
}

class Message31Header {
    constructor(file) {
        this.initPosition = file.getPosition();
        this.stationIdentifier = file.readString(4); // 0-3

        this.collectionTime = file.readInteger(4); // 4-7
        this.collectionDate = file.readInteger(2); // 8-9
        this.azimuthNumber = file.readInteger(2); // 10-11
        this.azimuthAngle = file.readReal(4); // 12-15

        this.compressionIndicator = file.readCode(1); // 16
        file.skip(1); // 17 Spare
        this.radialLength = file.readInteger(2); // 18-19
        this.azimuthResolutionSpacing = file.readCode(1); // 20

        this.radialStatus = file.readCode(1); // 21
        this.elevationNumber = file.readInteger(1); // 22
        this.cutSectorNumber = file.readInteger(1); // 23
        this.elevationAngle = file.readReal(4); // 24-27

        this.radialSpotBlankingStatus = file.readCode(1); // 28
        this.azimuthIndexingMode = file.readScaledInteger(1, 0.01); // 29
        this.dataBlockCount = file.readInteger(2); // 30-31

        this.volumeDCTpointer = file.readInteger(4); // 32-35
        this.elevationDCTpointer = file.readInteger(4); // 36-39
        this.radialDCTpointer = file.readInteger(4); // 40-43
        this.refPointer = file.readInteger(4); // 44-47
        this.velPointer = file.readInteger(4); // 48-51 
        this.swPointer = file.readInteger(4); // 52 - 55
        this.zdrPointer = file.readInteger(4); // 56 - 59
        this.phiPointer = file.readInteger(4); // 60 - 63
        this.rhoPointer = file.readInteger(4); // 64 - 67
        this.dataBlockPointers = [this.refPointer, this.velPointer, this.swPointer, this.zdrPointer, this.phiPointer, this.rhoPointer];
    }
}

class Message2Header {
    constructor(file) {
        file.skip(54);
    }
}

exports.MessageHeader = MessageHeader;
exports.Message31Header = Message31Header;
exports.Message2Header = Message2Header;