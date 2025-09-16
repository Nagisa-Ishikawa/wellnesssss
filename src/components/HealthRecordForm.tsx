import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HealthRecord, MoodLevel, DiscomfortType, PMSSymptom, BloodFlow } from '../types';
import { getRecord, saveRecord, formatDate } from '../utils/storage';

const HealthRecordForm: React.FC = () => {
  const { date } = useParams<{ date?: string }>();
  const navigate = useNavigate();
  const recordDate = date || formatDate(new Date());
  
  const [record, setRecord] = useState<HealthRecord>({
    date: recordDate
  });

  useEffect(() => {
    const loadRecord = async () => {
      const existingRecord = await getRecord(recordDate);
      if (existingRecord) {
        setRecord(existingRecord);
      }
    };
    loadRecord();
  }, [recordDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord(recordDate, record);
    navigate('/');
  };

  const moodOptions: { value: MoodLevel; label: string }[] = [
    { value: 'good', label: '良い' },
    { value: 'somewhat-good', label: 'やや良い' },
    { value: 'normal', label: '普通' },
    { value: 'somewhat-bad', label: 'やや悪い' },
    { value: 'bad', label: '悪い' }
  ];

  const discomfortOptions: { value: DiscomfortType; label: string }[] = [
    { value: 'headache', label: '頭痛' },
    { value: 'stomachache', label: '腹痛' },
    { value: 'nausea', label: '吐き気' },
    { value: 'diarrhea', label: '下痢' },
    { value: 'constipation', label: '便秘' },
    { value: 'fatigue', label: '倦怠感' },
    { value: 'dizziness', label: 'めまい' },
    { value: 'other', label: 'その他' }
  ];

  const pmsOptions: { value: PMSSymptom; label: string }[] = [
    { value: 'irritability', label: 'イライラ' },
    { value: 'headache', label: '頭痛' },
    { value: 'dizziness', label: 'めまい' },
    { value: 'breast-tenderness', label: '乳房の張り' },
    { value: 'swelling', label: 'むくみ' },
    { value: 'other', label: 'その他' }
  ];

  const bloodFlowOptions: { value: BloodFlow; label: string }[] = [
    { value: 'light', label: '少ない' },
    { value: 'normal', label: '普通' },
    { value: 'heavy', label: '多い' }
  ];

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '20px' }}>
        体調記録 - {new Date(recordDate).toLocaleDateString('ja-JP')}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* 気分記録 */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>気分</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {moodOptions.map(({ value, label }) => (
              <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="mood"
                  value={value}
                  checked={record.mood === value}
                  onChange={(e) => setRecord({ ...record, mood: e.target.value as MoodLevel })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* 日記 */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>日記</h3>
          <textarea
            value={record.diary || ''}
            onChange={(e) => setRecord({ ...record, diary: e.target.value })}
            style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="今日の出来事や気持ちを記録してください"
          />
        </div>

        {/* 体調データ */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>体調データ</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>体温 (°C)</label>
              <input
                type="number"
                step="0.1"
                value={record.temperature || ''}
                onChange={(e) => setRecord({ ...record, temperature: e.target.value ? parseFloat(e.target.value) : undefined })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>体重 (kg)</label>
              <input
                type="number"
                step="0.1"
                value={record.weight || ''}
                onChange={(e) => setRecord({ ...record, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>血圧（上）</label>
              <input
                type="number"
                value={record.bloodPressure?.upper || ''}
                onChange={(e) => setRecord({ 
                  ...record, 
                  bloodPressure: { 
                    ...record.bloodPressure, 
                    upper: e.target.value ? parseInt(e.target.value) : 0,
                    lower: record.bloodPressure?.lower || 0
                  } 
                })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>血圧（下）</label>
              <input
                type="number"
                value={record.bloodPressure?.lower || ''}
                onChange={(e) => setRecord({ 
                  ...record, 
                  bloodPressure: { 
                    upper: record.bloodPressure?.upper || 0,
                    lower: e.target.value ? parseInt(e.target.value) : 0
                  } 
                })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>心拍数</label>
              <input
                type="number"
                value={record.heartRate || ''}
                onChange={(e) => setRecord({ ...record, heartRate: e.target.value ? parseInt(e.target.value) : undefined })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
          </div>
        </div>

        {/* 不調 */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>不調</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '10px' }}>
            {discomfortOptions.map(({ value, label }) => (
              <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={record.discomforts?.includes(value) || false}
                  onChange={(e) => {
                    const discomforts = record.discomforts || [];
                    if (e.target.checked) {
                      setRecord({ ...record, discomforts: [...discomforts, value] });
                    } else {
                      setRecord({ ...record, discomforts: discomforts.filter(d => d !== value) });
                    }
                  }}
                />
                {label}
              </label>
            ))}
          </div>
          <textarea
            value={record.discomfortNote || ''}
            onChange={(e) => setRecord({ ...record, discomfortNote: e.target.value })}
            placeholder="不調の詳細があれば記録してください"
            style={{ width: '100%', height: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* 月経記録 */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>月経記録</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>経血量</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              {bloodFlowOptions.map(({ value, label }) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="bloodFlow"
                    value={value}
                    checked={record.menstruation?.bloodFlow === value}
                    onChange={(e) => setRecord({ 
                      ...record, 
                      menstruation: { 
                        ...record.menstruation, 
                        bloodFlow: e.target.value as BloodFlow 
                      } 
                    })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                checked={record.menstruation?.cramps || false}
                onChange={(e) => setRecord({ 
                  ...record, 
                  menstruation: { 
                    ...record.menstruation, 
                    cramps: e.target.checked 
                  } 
                })}
              />
              生理痛がある
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>PMS症状</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '10px' }}>
              {pmsOptions.map(({ value, label }) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={record.menstruation?.pms?.includes(value) || false}
                    onChange={(e) => {
                      const pms = record.menstruation?.pms || [];
                      const updatedPms = e.target.checked 
                        ? [...pms, value]
                        : pms.filter(p => p !== value);
                      setRecord({ 
                        ...record, 
                        menstruation: { 
                          ...record.menstruation, 
                          pms: updatedPms 
                        } 
                      });
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
            {record.menstruation?.pms?.includes('other') && (
              <input
                type="text"
                value={record.menstruation?.pmsOther || ''}
                onChange={(e) => setRecord({ 
                  ...record, 
                  menstruation: { 
                    ...record.menstruation, 
                    pmsOther: e.target.value 
                  } 
                })}
                placeholder="その他のPMS症状"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
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
            保存
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthRecordForm;