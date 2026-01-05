const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getOptionChainSnapshot } = require('./services/db.service');

let mainWindow = null;

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

  console.log('✅ Electron app ready');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/**
 * IPC: Get one snapshot of option chain
 */
ipcMain.handle('get-option-chain-snapshot', async (_event, params) => {
  try {
    const data = await getOptionChainSnapshot(params);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Snapshot IPC error:', err);
    return { success: false, error: err.message };
  }
});
