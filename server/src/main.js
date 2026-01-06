const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const {
  playbackStep,
  getAvailableSymbols,
  getAvailableExpiries,
  getAvailableDates,
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

  // React dev server
  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  console.log('🪟 Electron window created');
}

ipcMain.handle('playback-step', async (_, params) => {
  return await playbackStep(params);
});
ipcMain.handle('get-symbols', async () => getAvailableSymbols());
ipcMain.handle('get-expiries', async (_, symbol) => getAvailableExpiries(symbol));
ipcMain.handle('get-dates', async (_, params) =>
  getAvailableDates(params.symbol, params.expiry)
);

app.whenReady().then(() => {
  console.log('✅ Electron app ready');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
