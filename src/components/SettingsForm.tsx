import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../utils/storage';
import { AppSettings } from '../types';

const SettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    displayItems: [],
    itemOrder: [],
    discomfortOptions: [],
    summaryItems: []
  });
  const [newDiscomfort, setNewDiscomfort] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const currentSettings = await getSettings();
      setSettings(currentSettings);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    await saveSettings(settings);
    alert('設定を保存しました');
  };

  const availableItems = [
    { id: 'mood', label: '気分' },
    { id: 'diary', label: '日記' },
    { id: 'temperature', label: '体温' },
    { id: 'weight', label: '体重' },
    { id: 'bloodPressure', label: '血圧' },
    { id: 'heartRate', label: '心拍数' },
    { id: 'discomforts', label: '不調' },
    { id: 'menstruation', label: '月経記録' }
  ];

  const toggleDisplayItem = (itemId: string) => {
    const updatedDisplayItems = settings.displayItems.includes(itemId)
      ? settings.displayItems.filter(id => id !== itemId)
      : [...settings.displayItems, itemId];
    
    setSettings({ 
      ...settings, 
      displayItems: updatedDisplayItems,
      itemOrder: settings.itemOrder.filter(id => updatedDisplayItems.includes(id))
    });
  };

  const toggleSummaryItem = (itemId: string) => {
    const updatedSummaryItems = settings.summaryItems.includes(itemId)
      ? settings.summaryItems.filter(id => id !== itemId)
      : [...settings.summaryItems, itemId];
    
    setSettings({ ...settings, summaryItems: updatedSummaryItems });
  };

  const addDiscomfort = () => {
    if (newDiscomfort.trim() && !settings.discomfortOptions.includes(newDiscomfort.trim())) {
      setSettings({
        ...settings,
        discomfortOptions: [...settings.discomfortOptions, newDiscomfort.trim()]
      });
      setNewDiscomfort('');
    }
  };

  const removeDiscomfort = (discomfort: string) => {
    setSettings({
      ...settings,
      discomfortOptions: settings.discomfortOptions.filter(d => d !== discomfort)
    });
  };

  const moveItemUp = (itemId: string) => {
    const currentIndex = settings.itemOrder.indexOf(itemId);
    if (currentIndex > 0) {
      const newOrder = [...settings.itemOrder];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
      setSettings({ ...settings, itemOrder: newOrder });
    }
  };

  const moveItemDown = (itemId: string) => {
    const currentIndex = settings.itemOrder.indexOf(itemId);
    if (currentIndex < settings.itemOrder.length - 1) {
      const newOrder = [...settings.itemOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setSettings({ ...settings, itemOrder: newOrder });
    }
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '30px' }}>アプリ設定</h2>

      {/* 記録項目の表示設定 */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>記録項目の表示設定</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          表示したい項目にチェックを入れてください
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {availableItems.map(item => (
            <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={settings.displayItems.includes(item.id)}
                onChange={() => toggleDisplayItem(item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      {/* 項目の表示順序 */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>項目の表示順序</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          表示項目の順序を変更できます
        </p>
        {settings.itemOrder
          .filter(itemId => settings.displayItems.includes(itemId))
          .map((itemId, index) => {
            const item = availableItems.find(i => i.id === itemId);
            if (!item) return null;
            
            return (
              <div 
                key={itemId} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  marginBottom: '5px'
                }}
              >
                <span style={{ flex: 1 }}>{item.label}</span>
                <button
                  onClick={() => moveItemUp(itemId)}
                  disabled={index === 0}
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    opacity: index === 0 ? 0.5 : 1
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItemDown(itemId)}
                  disabled={index === settings.itemOrder.filter(id => settings.displayItems.includes(id)).length - 1}
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: index === settings.itemOrder.filter(id => settings.displayItems.includes(id)).length - 1 ? 'not-allowed' : 'pointer',
                    opacity: index === settings.itemOrder.filter(id => settings.displayItems.includes(id)).length - 1 ? 0.5 : 1
                  }}
                >
                  ↓
                </button>
              </div>
            );
          })}
      </div>

      {/* 不調の選択肢編集 */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>不調の選択肢</h3>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={newDiscomfort}
              onChange={(e) => setNewDiscomfort(e.target.value)}
              placeholder="新しい不調項目を入力"
              style={{ 
                flex: 1, 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }}
            />
            <button
              onClick={addDiscomfort}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              追加
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {settings.discomfortOptions.map(discomfort => (
              <div 
                key={discomfort}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}
              >
                <span>{discomfort}</span>
                <button
                  onClick={() => removeDiscomfort(discomfort)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    width: '20px',
                    height: '20px'
                  }}
                  title="削除"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* サマリーグラフの表示設定 */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>サマリーグラフの表示項目</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          ホーム画面に表示するグラフを選択してください
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {availableItems
            .filter(item => ['mood', 'temperature', 'weight', 'heartRate'].includes(item.id))
            .map(item => (
              <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={settings.summaryItems.includes(item.id)}
                  onChange={() => toggleSummaryItem(item.id)}
                />
                {item.label}のグラフ
              </label>
            ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          設定を保存
        </button>
      </div>
    </div>
  );
};

export default SettingsForm;