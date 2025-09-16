export interface ElectronAPI {
  loadData: () => Promise<any>;
  saveData: (data: any) => Promise<{ success: boolean }>;
  getDataPath: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}