const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const {
  playbackStep,
  getAvailableSymbols,
  getAvailableDates,
  getExpiriesByDate,
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

  mainWindow.loadURL('http://localhost:3000');
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

ipcMain.handle('playback-step', async (_, params) =>
  playbackStep(params)
);
