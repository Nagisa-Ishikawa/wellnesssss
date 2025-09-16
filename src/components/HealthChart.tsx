import React from "react";
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
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { getAllRecords, getSettings } from "../utils/storage";
import { HealthRecord, MoodLevel, AppSettings } from "../types";

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
  chartType?: "line" | "bar";
  dataType: "mood" | "temperature" | "weight" | "heartRate";
  period?: number; // 表示する日数
  customDateRange?: {
    startDate: Date;
    endDate: Date;
  };
  onCustomDateRangeChange?: (dateRange: { startDate: Date; endDate: Date } | null) => void;
}

const HealthChart: React.FC<HealthChartProps> = ({
  chartType = "line",
  dataType,
  period = 14,
  customDateRange,
  onCustomDateRangeChange,
}) => {
  const [records, setRecords] = React.useState<Record<string, HealthRecord>>(
    {}
  );
  const [settings, setSettings] = React.useState<AppSettings | null>(null);
  const [currentOffset, setCurrentOffset] = React.useState(0);
  const [isSwipeStarted, setIsSwipeStarted] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [currentX, setCurrentX] = React.useState(0);

  React.useEffect(() => {
    const loadData = async () => {
      const [recordsData, settingsData] = await Promise.all([
        getAllRecords(),
        getSettings()
      ]);
      setRecords(recordsData);
      setSettings(settingsData);
    };
    loadData();
  }, []);

  // 指定期間のデータを取得
  const getData = () => {
    const dates: string[] = [];
    const data: (number | null)[] = [];

    if (customDateRange) {
      // カスタム日付範囲の場合
      const { startDate, endDate } = customDateRange;
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        dates.push(
          currentDate.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })
        );

        const record = records[dateString];
        let value: number | null = null;

        if (record) {
          switch (dataType) {
            case "mood":
              value = getMoodValue(record.mood);
              break;
            case "temperature":
              value = record.temperature || null;
              break;
            case "weight":
              value = record.weight || null;
              break;
            case "heartRate":
              value = record.heartRate || null;
              break;
          }
        }

        data.push(value);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // 通常の期間表示
      const today = new Date();
      for (let i = period - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i - currentOffset);
        const dateString = date.toISOString().split("T")[0];
        dates.push(
          date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })
        );

        const record = records[dateString];
        let value: number | null = null;

        if (record) {
          switch (dataType) {
            case "mood":
              value = getMoodValue(record.mood);
              break;
            case "temperature":
              value = record.temperature || null;
              break;
            case "weight":
              value = record.weight || null;
              break;
            case "heartRate":
              value = record.heartRate || null;
              break;
          }
        }

        data.push(value);
      }
    }

    return { dates, data };
  };

  // 現在の期間の長さを取得
  const getCurrentPeriodLength = () => {
    if (customDateRange) {
      const { startDate, endDate } = customDateRange;
      const timeDiff = endDate.getTime() - startDate.getTime();
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // 日数を計算
    }
    return period;
  };

  // 前の期間に移動
  const goToPreviousPeriod = () => {
    if (customDateRange && onCustomDateRangeChange) {
      // カスタム日付範囲を現在の期間の長さ分前にシフト
      const { startDate, endDate } = customDateRange;
      const currentPeriodLength = getCurrentPeriodLength();
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      newStartDate.setDate(startDate.getDate() - currentPeriodLength);
      newEndDate.setDate(endDate.getDate() - currentPeriodLength);
      onCustomDateRangeChange({ startDate: newStartDate, endDate: newEndDate });
    } else {
      setCurrentOffset(currentOffset + period);
    }
  };

  // 次の期間に移動
  const goToNextPeriod = () => {
    if (customDateRange && onCustomDateRangeChange) {
      // カスタム日付範囲を現在の期間の長さ分後にシフト
      const { startDate, endDate } = customDateRange;
      const currentPeriodLength = getCurrentPeriodLength();
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      newStartDate.setDate(startDate.getDate() + currentPeriodLength);
      newEndDate.setDate(endDate.getDate() + currentPeriodLength);
      onCustomDateRangeChange({ startDate: newStartDate, endDate: newEndDate });
    } else {
      setCurrentOffset(currentOffset - period);
    }
  };

  // 現在の期間を取得（表示用）
  const getCurrentPeriodLabel = () => {
    if (customDateRange) {
      const { startDate, endDate } = customDateRange;
      return `${startDate.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      })} - ${endDate.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      })}`;
    }

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - currentOffset);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - period + 1);

    return `${startDate.toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    })}`;
  };

  // スワイプ/ドラッグ開始
  const handleSwipeStart = (clientX: number) => {
    setIsSwipeStarted(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  // スワイプ/ドラッグ中
  const handleSwipeMove = (clientX: number) => {
    if (!isSwipeStarted) return;
    setCurrentX(clientX);
  };

  // スワイプ/ドラッグ終了
  const handleSwipeEnd = () => {
    if (!isSwipeStarted) return;

    const diffX = currentX - startX;
    const threshold = 50; // スワイプの閾値

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // 右スワイプ = 前の期間
        goToPreviousPeriod();
      } else {
        // 左スワイプ = 次の期間
        goToNextPeriod();
      }
    }

    setIsSwipeStarted(false);
    setStartX(0);
    setCurrentX(0);
  };

  // マウスイベント
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSwipeStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSwipeMove(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSwipeEnd();
  };

  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent) => {
    handleSwipeStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleSwipeMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleSwipeEnd();
  };

  const getMoodValue = (mood?: MoodLevel): number | null => {
    switch (mood) {
      case "bad":
        return 1;
      case "somewhat-bad":
        return 2;
      case "normal":
        return 3;
      case "somewhat-good":
        return 4;
      case "good":
        return 5;
      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (dataType) {
      case "mood":
        return "気分の推移";
      case "temperature":
        return "体温の推移";
      case "weight":
        return "体重の推移";
      case "heartRate":
        return "心拍数の推移";
      default:
        return "データ推移";
    }
  };

  const getYAxisLabel = () => {
    switch (dataType) {
      case "mood":
        return "気分レベル";
      case "temperature":
        return "体温 (°C)";
      case "weight":
        return "体重 (kg)";
      case "heartRate":
        return "心拍数 (bpm)";
      default:
        return "値";
    }
  };

  const { dates, data } = getData();

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: getYAxisLabel(),
        data: data,
        borderColor:
          dataType === "mood" ? "rgb(255, 99, 132)" : "rgb(53, 162, 235)",
        backgroundColor:
          dataType === "mood"
            ? "rgba(255, 99, 132, 0.5)"
            : "rgba(53, 162, 235, 0.5)",
        tension: 0.1,
        spanGaps: true, // nullがあっても線をつなげる
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
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
        ...(dataType === "mood" && {
          min: 1,
          max: 5,
          ticks: {
            callback: function (value: any) {
              const labels = [
                "",
                "悪い",
                "やや悪い",
                "普通",
                "やや良い",
                "良い",
              ];
              return labels[value] || value;
            },
          },
        }),
        ...(dataType === "weight" && settings && {
          min: settings.chartRanges.weight.min,
          max: settings.chartRanges.weight.max,
        }),
        ...(dataType === "temperature" && settings && {
          min: settings.chartRanges.temperature.min,
          max: settings.chartRanges.temperature.max,
        }),
      },
      x: {
        title: {
          display: true,
          text: "日付",
        },
      },
    },
  };

  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "15px",
          fontSize: "14px",
          color: "#666",
          fontWeight: "500",
        }}
      >
        {getCurrentPeriodLabel()}
      </div>

      <div
        style={{
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-y",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={isSwipeStarted ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {chartType === "line" ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default HealthChart;
