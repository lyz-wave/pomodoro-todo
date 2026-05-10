const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')

let mainWindow = null
let floatingWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 720,
    minHeight: 480,
    title: 'Pomodoro + Todo',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#171412',
    show: false,
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createFloatingWindow() {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.focus()
    return
  }

  const { width: screenW } = screen.getPrimaryDisplay().workAreaSize

  floatingWindow = new BrowserWindow({
    width: 220,
    height: 260,
    x: screenW - 230,
    y: 60,
    alwaysOnTop: true,
    resizable: false,
    frame: false,
    skipTaskbar: true,
    backgroundColor: '#171412',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    parent: mainWindow,
    show: false,
  })

  if (process.env.NODE_ENV === 'dev') {
    floatingWindow.loadURL('http://localhost:5173?floating=1')
  } else {
    floatingWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      query: { floating: '1' },
    })
  }

  floatingWindow.once('ready-to-show', () => {
    floatingWindow.show()
  })

  floatingWindow.on('closed', () => {
    floatingWindow = null
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('floating-window-closed')
    }
  })
}

function destroyFloatingWindow() {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.close()
    floatingWindow = null
  }
}

// IPC handlers
function setupIPC() {
  ipcMain.on('toggle-floating-window', () => {
    if (floatingWindow && !floatingWindow.isDestroyed()) {
      destroyFloatingWindow()
    } else {
      createFloatingWindow()
    }
  })

  ipcMain.on('timer-state-update', (_event, state) => {
    if (floatingWindow && !floatingWindow.isDestroyed()) {
      floatingWindow.webContents.send('timer-state-update', state)
    }
  })

  ipcMain.on('timer-action', (_event, action) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('timer-action', action)
    }
  })
}

// Notification permission
app.on('web-contents-created', (_event, contents) => {
  contents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'notifications') callback(true)
    else callback(false)
  })
})

app.whenReady().then(() => {
  setupIPC()
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
