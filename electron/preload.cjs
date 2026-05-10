const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  sendTimerState: (state) => ipcRenderer.send('timer-state-update', state),
  onTimerUpdate: (callback) => {
    ipcRenderer.on('timer-state-update', (_event, state) => callback(state))
  },

  sendTimerAction: (action) => ipcRenderer.send('timer-action', action),
  onTimerAction: (callback) => {
    ipcRenderer.on('timer-action', (_event, action) => callback(action))
  },

  toggleFloatingWindow: () => ipcRenderer.send('toggle-floating-window'),
  onFloatingWindowClosed: (callback) => {
    ipcRenderer.on('floating-window-closed', () => callback())
  },
})
