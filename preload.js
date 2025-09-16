const { contextBridge, ipcRenderer } = require('electron');

// セキュアなAPIをレンダラープロセスに公開
contextBridge.exposeInMainWorld('electronAPI', {
  // データの読み込み
  loadData: () => ipcRenderer.invoke('load-data'),
  
  // データの保存
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  
  // データファイルのパスを取得
  getDataPath: () => ipcRenderer.invoke('get-data-path')
});