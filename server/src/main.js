const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const {
  playbackStep,
  getAvailableSymbols,
  getAvailableDates,
  getExpiriesByDate,
  getAvailableTimestamps,
  getSnapshot,
} = require('./services/db.service');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, '../../client/dist/index.html')
    );
  }
  console.log('🪟 Electron window created');
}

app.whenReady().then(() => {
  createWindow();
  console.log('✅ Electron app ready');
});

ipcMain.handle('get-symbols', async () => getAvailableSymbols());

ipcMain.handle('get-dates', async (_, params) =>
  getAvailableDates(params.symbol)
);

ipcMain.handle('get-expiries-by-date', async (_, params) =>
  getExpiriesByDate(params.symbol, params.tradeDate)
);

ipcMain.handle('get-timestamps', async (_, params) =>
  getAvailableTimestamps(params.symbol, params.tradeDate, params.expiry)
);

ipcMain.handle('get-snapshot', async (_, params) =>
  getSnapshot(params.symbol, params.expiry, new Date(params.timestamp))
);

ipcMain.handle('playback-step', async (_, params) =>
  playbackStep(params)
);
