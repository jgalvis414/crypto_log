const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('------ Iniciando Electron JS ------');

function createWindow() {
  console.log('Abriendo ventana Electron...');
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
