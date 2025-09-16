const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

// データファイルのパスを設定
const dataDir = path.join(os.homedir(), '.wellness-app');
const dataFile = path.join(dataDir, 'health-data.json');

// データディレクトリを作成
async function ensureDataDir() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// データを読み込む
async function loadData() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // ファイルが存在しない場合はデフォルトデータを返す
    return {
      records: {},
      settings: {
        displayItems: ['mood', 'temperature', 'weight', 'bloodPressure', 'heartRate'],
        itemOrder: ['mood', 'temperature', 'weight', 'bloodPressure', 'heartRate'],
        discomfortOptions: ['頭痛', '腹痛', '吐き気', '下痢', '便秘', '倦怠感', 'めまい', 'その他'],
        summaryItems: ['mood', 'temperature']
      }
    };
  }
}

// データを保存する
async function saveData(data) {
  await ensureDataDir();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

// IPC ハンドラーの設定
function setupIpcHandlers() {
  ipcMain.handle('load-data', async () => {
    return await loadData();
  });

  ipcMain.handle('save-data', async (event, data) => {
    await saveData(data);
    return { success: true };
  });

  ipcMain.handle('get-data-path', () => {
    return dataFile;
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});