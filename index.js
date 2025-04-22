const { app, BrowserWindow } = require('electron');
const WebSocket = require('ws');

app.on('ready', () => {
  // Create the main app window and load index.html
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadFile((__dirname, 'src/index.html'));

  // Create WebSocket Server
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message);

      const printWindow = new BrowserWindow({ show: false });
      printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(data.data)}`);
      printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.print(data.options, (success, errorType) => {
          if (!success) console.error('Print failed:', errorType);
          printWindow.close();
        });
      });
    });
  });

  console.log('WebSocket server running on ws://localhost:8080');
});

app.on('window-all-closed', (event) => event.preventDefault());
