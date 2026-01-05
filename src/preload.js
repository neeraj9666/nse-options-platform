const { contextBridge, ipcRenderer } = require('electron');

/**
 * Secure IPC bridge exposed to Renderer (React)
 * No Node APIs leak into UI
 */
contextBridge.exposeInMainWorld('api', {
  /**
   * Fetch one option chain snapshot
   * @param {Object} params
   * @param {string} params.symbol
   * @param {string} params.expiry (YYYY-MM-DD)
   * @param {string} params.atTime (TIMESTAMPTZ)
   */
  getOptionChainSnapshot: (params) =>
    ipcRenderer.invoke('get-option-chain-snapshot', params),
});
