import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getAllRecords } from '../utils/storage';
import { MoodLevel, HealthRecord } from '../types';

interface CalendarProps {
  currentDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate = new Date() }) => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record<string, HealthRecord>>({});
  
  useEffect(() => {
    const loadRecords = async () => {
      const data = await getAllRecords();
      setRecords(data);
    };
    loadRecords();
  }, []);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 月曜始まりに調整（0=日曜, 1=月曜）
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    const days = [];
    
    // 前月の日付を埋める
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date: Date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        dateString: formatDate(date)
      });
    }
    
    // 当月の日付
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dateString: formatDate(date)
      });
    }
    
    // 次月の日付を埋める（6週表示にする）
    while (days.length < 42) {
      const nextMonthDay = days.length - lastDay.getDate() - firstDayOfWeek + 1;
      const date: Date = new Date(year, month + 1, nextMonthDay);
      days.push({
        date,
        isCurrentMonth: false,
        dateString: formatDate(date)
      });
    }
    
    return days;
  }, [currentDate]);

  const getMoodColor = (mood?: MoodLevel): string => {
    switch (mood) {
      case 'good':
        return '#4CAF50'; // 濃い緑
      case 'somewhat-good':
        return '#8BC34A'; // 薄い緑
      case 'normal':
        return '#FFC107'; // 黄
      case 'somewhat-bad':
        return '#FF9800'; // オレンジ
      case 'bad':
        return '#F44336'; // 赤
      default:
        return 'transparent';
    }
  };

  const handleDateClick = (dateString: string) => {
    navigate(`/record/${dateString}`);
  };

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
        {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '10px' }}>
        {weekdays.map(day => (
          <div key={day} style={{ 
            padding: '10px', 
            textAlign: 'center', 
            fontWeight: 'bold',
            backgroundColor: '#f5f5f5'
          }}>
            {day}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {calendarData.map(({ date, isCurrentMonth, dateString }) => {
          const record = records[dateString];
          const mood = record?.mood;
          const hasRecord = !!record;
          
          return (
            <div
              key={dateString}
              onClick={() => handleDateClick(dateString)}
              style={{
                padding: '15px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: hasRecord ? getMoodColor(mood) : '#f9f9f9',
                opacity: isCurrentMonth ? 1 : 0.5,
                color: hasRecord ? 'white' : '#333',
                fontWeight: hasRecord ? 'bold' : 'normal',
                border: dateString === formatDate(new Date()) ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!hasRecord) {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (!hasRecord) {
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                }
              }}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#4CAF50', borderRadius: '2px' }}></div>
            <span>良い</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#8BC34A', borderRadius: '2px' }}></div>
            <span>やや良い</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#FFC107', borderRadius: '2px' }}></div>
            <span>普通</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#FF9800', borderRadius: '2px' }}></div>
            <span>やや悪い</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#F44336', borderRadius: '2px' }}></div>
            <span>悪い</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;