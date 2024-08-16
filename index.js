const { app, BrowserWindow, ipcMain } = require('electron')
//const { Level2Archive } = require('./backend/parser/Level2Archive')
const { NexradFetcher } = require('./backend/datamanagement/NexradFetcher');

const path = require('path');
//const { ElevationDataConstantType } = require('./backend/parser/RadialData');

const fetcher = new NexradFetcher('KRLX');


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    contextIsolation: false,
    nodeIntegration: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
    }
  })
  fetcher.win = win;
  fetcher.subscribe((arch) => {
    win.webContents.send('newData', arch)
  })

  win.loadFile('index.html');
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('archive', (event, station) => {
  fetcher.getLatestData().then(arch =>  {
    console.log(arch.radarStationName)
    event.reply('archive', arch)
  });
})

ipcMain.on('loop', (event, _) => {
  fetcher.getLoopData().then(loopData => {
    event.reply('loop', loopData);
  })
})

ipcMain.on('loopData', (event, _) => {
  event.returnValue = fetcher.loopArchives;
})

