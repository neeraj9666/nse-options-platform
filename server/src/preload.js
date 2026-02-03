const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getSymbols: () => ipcRenderer.invoke('get-symbols'),
  getDates: (params) => ipcRenderer.invoke('get-dates', params),
  getExpiriesByDate: (params) =>
    ipcRenderer.invoke('get-expiries-by-date', params),
  getTimestamps: (params) => ipcRenderer.invoke('get-timestamps', params),
  getSnapshot: (params) => ipcRenderer.invoke('get-snapshot', params),
  playbackStep: (params) =>
    ipcRenderer.invoke('playback-step', params),
});
