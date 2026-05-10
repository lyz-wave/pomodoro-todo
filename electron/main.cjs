const { app, BrowserWindow, Notification } = require('electron')
const path = require('path')

let mainWindow

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

// Override Notification to use Electron native notification
app.on('web-contents-created', (_event, contents) => {
  contents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'notifications') {
      callback(true)
    } else {
      callback(false)
    }
  })
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
