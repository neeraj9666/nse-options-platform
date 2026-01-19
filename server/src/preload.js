const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getSymbols: () => ipcRenderer.invoke('get-symbols'),
  getDates: (params) => ipcRenderer.invoke('get-dates', params),
  getExpiriesByDate: (params) =>
    ipcRenderer.invoke('get-expiries-by-date', params),
  playbackStep: (params) =>
    ipcRenderer.invoke('playback-step', params),
});
