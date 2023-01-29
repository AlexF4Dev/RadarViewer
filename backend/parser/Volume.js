class Volume {
    constructor(sweeps) {
        this.sweeps = []
        this.sweeps = sweeps;
    }
    //@Sweep
    getSweep(elevation) {
        const result = this.sweeps.filter(sweep => sweep.elevation == elevation);
        return result[0];
    }
}

exports.Volume = Volume;