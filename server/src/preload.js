const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  playbackStep: (params) =>
    ipcRenderer.invoke('playback-step', params),

  getSymbols: () =>
    ipcRenderer.invoke('get-symbols'),

  getExpiries: (symbol) =>
    ipcRenderer.invoke('get-expiries', symbol),

  getDates: (params) =>
    ipcRenderer.invoke('get-dates', params),
});
