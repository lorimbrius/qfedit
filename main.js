const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

// behave like any other standard window and exit the app when the last window is closed
// except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong');
    createWindow();

    // default behavior on macOS
    // no need for guard because this state can only exist on mac thanks to the 'windows-all-closed' guard above
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});