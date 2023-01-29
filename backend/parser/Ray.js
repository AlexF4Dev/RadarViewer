class Ray {
    /*constructor(refDataMoment, velDataMoment, swDataMoment, zdrDataMoment) {
        this.refDataMoment = refDataMoment;
        this.velDataMoment = velDataMoment;
        this.swDataMoment = swDataMoment;
        this.zdrDataMoment = zdrDataMoment;
    }*/

    constructor(datamoments) {
        this.dataMoments = datamoments;
        this.refDataMoment = datamoments[0];
        this.velDataMoment = datamoments[1];
        this.swDataMoment = datamoments[2];
        this.zdrDataMoment = datamoments[3];
    }
}

exports.Ray = Ray;