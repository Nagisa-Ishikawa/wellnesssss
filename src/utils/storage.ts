import { HealthRecord, AppSettings, AppData } from '../types';

const defaultSettings: AppSettings = {
  displayItems: ['mood', 'temperature', 'weight', 'bloodPressure', 'heartRate'],
  itemOrder: ['mood', 'temperature', 'weight', 'bloodPressure', 'heartRate'],
  discomfortOptions: ['頭痛', '腹痛', '吐き気', '下痢', '便秘', '倦怠感', 'めまい', 'その他'],
  summaryItems: ['mood', 'temperature'],
  chartRanges: {
    weight: { min: 20, max: 150 },
    temperature: { min: 20, max: 50 }
  }
};

// Electronの環境かどうかを確認
const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI;
};

export const loadData = async (): Promise<AppData> => {
  try {
    if (isElectron()) {
      // Electron環境：ファイルシステムから読み込み
      const data = await window.electronAPI.loadData();
      return {
        records: data.records || {},
        settings: { ...defaultSettings, ...data.settings }
      };
    } else {
      // ブラウザ環境：LocalStorageから読み込み（フォールバック）
      const data = localStorage.getItem('wellness-app-data');
      if (data) {
        const parsed = JSON.parse(data);
        return {
          records: parsed.records || {},
          settings: { ...defaultSettings, ...parsed.settings }
        };
      }
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  
  return {
    records: {},
    settings: defaultSettings
  };
};

export const saveData = async (data: AppData): Promise<void> => {
  try {
    if (isElectron()) {
      // Electron環境：ファイルシステムに保存
      await window.electronAPI.saveData(data);
    } else {
      // ブラウザ環境：LocalStorageに保存（フォールバック）
      localStorage.setItem('wellness-app-data', JSON.stringify(data));
    }
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const saveRecord = async (date: string, record: HealthRecord): Promise<void> => {
  const data = await loadData();
  data.records[date] = record;
  await saveData(data);
};

export const getRecord = async (date: string): Promise<HealthRecord | undefined> => {
  const data = await loadData();
  return data.records[date];
};

export const getAllRecords = async (): Promise<Record<string, HealthRecord>> => {
  const data = await loadData();
  return data.records;
};

export const getSettings = async (): Promise<AppSettings> => {
  const data = await loadData();
  return data.settings;
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  const data = await loadData();
  data.settings = settings;
  await saveData(data);
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};