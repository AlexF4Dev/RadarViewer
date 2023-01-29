const axios = require('axios').default;
const { Level2Archive } = require('../parser/Level2Archive')
const moment = require('moment-timezone');

const repositoryURL = "https://mesonet-nexrad.agron.iastate.edu/level2/raw/";

class NexradFetcher {
    constructor(station) {
        this.station = station;
        this.newestFileDate = null;
        this.win = null;
        this.loopArchives = [];
    }

    async getLatestData() {
        const arch = await this.getArchivedData(0);
        this.loopArchives.unshift(arch);
        if(this.loopArchives.length > 5) {
            this.loopArchives.pop();
        }
        this.newestFileDate = arch.formattedDate;
        this.scheduleNextFetch();

        return arch;
    }
    
    async getArchivedData(index) {
        const latestFileName = this.getFileNameAtIndex(index, await this.getDirectoryList());
        console.log(latestFileName)
        const resp = await axios.get(repositoryURL + this.station + "/" + latestFileName, {responseType: 'arraybuffer'});
        const buffer = resp.data;
        const arch = new Level2Archive().fromBuffer(buffer)
        arch.file = null;
        
        return arch;
    }
    
    async getLoopData() {
        console.log(this.loopArchives.length)
        if(this.loopArchives.length == 5) {
            return this.loopArchives;
        }

        for(var i = 0; i <= (6-this.loopArchives.length); i++) {
            //const archIndex = 5-i;
            console.log("Getting Archive " + i);
            this.loopArchives.push(await this.getArchivedData(i+1));
        }

        return this.loopArchives;
    }

    async getDirectoryList() {
        const res = await axios.get(repositoryURL + this.station + "/dir.list");
        return res.data;
    }

    getLatestFileName(dirList) {
        return this.getFileNameAtIndex(0, dirList)
    }

    getFileNameAtIndex(index, dirList) {
        const lines = dirList.split("\n");
        const latestLine = lines[lines.length - 3 - index];

        return latestLine.split(" ")[1];
    }

    scheduleNextFetch() {
        const interval = moment(this.newestFileDate, "MMM D, h:mm A").add(12, 'minutes').diff(moment(), 'seconds');
        console.log(`Checking for new data in ${interval} seconds...`)
        if(interval > 0) {
            this.win.webContents.send('etu', interval)
            setTimeout(async () => {
                if(this.onNewData) {
                    this.onNewData(await this.getLatestData());
                }
            }, interval*1000);
        } else {
            console.log("No new data found! Trying Again in 5 min...")
            this.win.webContents.send('etu', 5*60)
            setTimeout(async () => {
                if(this.onNewData) {
                    this.onNewData(await this.getLatestData());
                }
            }, 5*60*1000);
        }
        
    }

    subscribe(onNewData) {
        this.onNewData = onNewData;
    }
}

exports.NexradFetcher = NexradFetcher;