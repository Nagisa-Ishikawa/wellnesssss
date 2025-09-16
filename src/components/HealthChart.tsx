import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useChartData } from "../hooks/useChartData";
import { useSwipeInteraction } from "../hooks/useSwipeInteraction";
import { usePeriodNavigation } from "../hooks/usePeriodNavigation";
import { createChartData, createChartOptions } from "../utils/chartConfig";
import ChartTooltip from "./ChartTooltip";

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
  onCustomDateRangeChange?: (
    dateRange: { startDate: Date; endDate: Date } | null
  ) => void;
}

const HealthChart: React.FC<HealthChartProps> = ({
  chartType = "line",
  dataType,
  period = 14,
  customDateRange,
  onCustomDateRangeChange,
}) => {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    date: string;
  } | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  const {
    currentOffset,
    goToPreviousPeriod,
    goToNextPeriod,
    getCurrentPeriodLabel,
  } = usePeriodNavigation({
    period,
    customDateRange,
    onCustomDateRangeChange,
  });

  const { records, settings, getData } = useChartData({
    dataType,
    period,
    customDateRange,
    currentOffset,
  });

  const { isSwipeStarted, swipeHandlers } = useSwipeInteraction({
    onSwipeLeft: goToNextPeriod,
    onSwipeRight: goToPreviousPeriod,
  });


  const { dates, dateStrings, data } = getData();

  const handleChartClick = (event: any, elements: any[], chart: any) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 300 && elements.length > 0) {
      const elementIndex = elements[0].index;
      const dateString = dateStrings[elementIndex];

      const canvas = chart.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.native.clientX - rect.left;
      const y = event.native.clientY - rect.top;

      setTooltip({
        show: true,
        x: x,
        y: y,
        date: dateString,
      });
    }

    setLastClickTime(currentTime);
  };

  const chartData = createChartData(dates, data, dataType);
  const options = createChartOptions(dataType, settings, handleChartClick);

  const handleEditClick = () => {
    if (tooltip) {
      navigate(`/record/${tooltip.date}`);
      setTooltip(null);
    }
  };

  const handleTooltipClose = () => {
    setTooltip(null);
  };

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        position: "relative",
      }}
    >
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
        {...swipeHandlers}
        onMouseMove={isSwipeStarted ? swipeHandlers.onMouseMove : undefined}
        onClick={handleTooltipClose}
      >
        {chartType === "line" ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

      <ChartTooltip
        tooltip={tooltip}
        records={records}
        dataType={dataType}
        onEditClick={handleEditClick}
        onClose={handleTooltipClose}
      />
    </div>
  );
};

export default HealthChart;
