import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getAllRecords } from '../utils/storage';
import { HealthRecord, MoodLevel } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HealthChartProps {
  chartType?: 'line' | 'bar';
  dataType: 'mood' | 'temperature' | 'weight' | 'heartRate';
  period?: number; // 表示する日数
}

const HealthChart: React.FC<HealthChartProps> = ({
  chartType = 'line',
  dataType,
  period = 14
}) => {
  const [records, setRecords] = React.useState<Record<string, HealthRecord>>({});
  const [currentOffset, setCurrentOffset] = React.useState(0); // 現在の表示期間のオフセット

  React.useEffect(() => {
    const loadRecords = async () => {
      const data = await getAllRecords();
      setRecords(data);
    };
    loadRecords();
  }, []);
  
  // 指定期間のデータを取得
  const getData = () => {
    const today = new Date();
    const dates: string[] = [];
    const data: (number | null)[] = [];

    for (let i = period - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i - currentOffset);
      const dateString = date.toISOString().split('T')[0];
      dates.push(date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }));

      const record = records[dateString];
      let value: number | null = null;

      if (record) {
        switch (dataType) {
          case 'mood':
            value = getMoodValue(record.mood);
            break;
          case 'temperature':
            value = record.temperature || null;
            break;
          case 'weight':
            value = record.weight || null;
            break;
          case 'heartRate':
            value = record.heartRate || null;
            break;
        }
      }

      data.push(value);
    }

    return { dates, data };
  };

  // 前の期間に移動
  const goToPreviousPeriod = () => {
    setCurrentOffset(currentOffset + period);
  };

  // 次の期間に移動
  const goToNextPeriod = () => {
    if (currentOffset >= period) {
      setCurrentOffset(currentOffset - period);
    }
  };

  // 現在の期間を取得（表示用）
  const getCurrentPeriodLabel = () => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - currentOffset);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - period + 1);

    return `${startDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })} - ${endDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}`;
  };

  const getMoodValue = (mood?: MoodLevel): number | null => {
    switch (mood) {
      case 'bad': return 1;
      case 'somewhat-bad': return 2;
      case 'normal': return 3;
      case 'somewhat-good': return 4;
      case 'good': return 5;
      default: return null;
    }
  };

  const getChartTitle = () => {
    switch (dataType) {
      case 'mood': return '気分の推移';
      case 'temperature': return '体温の推移';
      case 'weight': return '体重の推移';
      case 'heartRate': return '心拍数の推移';
      default: return 'データ推移';
    }
  };

  const getYAxisLabel = () => {
    switch (dataType) {
      case 'mood': return '気分レベル';
      case 'temperature': return '体温 (°C)';
      case 'weight': return '体重 (kg)';
      case 'heartRate': return '心拍数 (bpm)';
      default: return '値';
    }
  };

  const { dates, data } = getData();

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: getYAxisLabel(),
        data: data,
        borderColor: dataType === 'mood' ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
        backgroundColor: dataType === 'mood' ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
        spanGaps: true, // nullがあっても線をつなげる
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: getChartTitle(),
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: getYAxisLabel(),
        },
        ...(dataType === 'mood' && {
          min: 1,
          max: 5,
          ticks: {
            callback: function(value: any) {
              const labels = ['', '悪い', 'やや悪い', '普通', 'やや良い', '良い'];
              return labels[value] || value;
            }
          }
        })
      },
      x: {
        title: {
          display: true,
          text: '日付',
        },
      },
    },
  };


  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <button
          onClick={goToPreviousPeriod}
          style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← 前
        </button>

        <div style={{
          fontSize: '14px',
          color: '#666',
          fontWeight: '500'
        }}>
          {getCurrentPeriodLabel()}
        </div>

        <button
          onClick={goToNextPeriod}
          disabled={currentOffset < period}
          style={{
            background: currentOffset < period ? '#e9ecef' : '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: currentOffset < period ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            color: currentOffset < period ? '#6c757d' : 'inherit'
          }}
        >
          次 →
        </button>
      </div>

      {chartType === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default HealthChart;