import React, { useState } from "react";
import Calendar from "../components/Calendar";
import HealthChart from "../components/HealthChart";

const HomePage: React.FC = () => {
  // 初期表示で本日の週とその前の週を設定
  const getInitialDateRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // 月曜始まりに調整

    // 今週の月曜日
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - dayOfWeek);

    // 前週の月曜日
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

    // 今週の日曜日
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

    return {
      startDate: previousWeekStart,
      endDate: currentWeekEnd
    };
  };

  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  } | null>(getInitialDateRange());

  const handleWeekSelect = (startDate: Date, endDate: Date) => {
    setSelectedDateRange({ startDate, endDate });
  };

  const handleCustomDateRangeChange = (dateRange: { startDate: Date; endDate: Date } | null) => {
    setSelectedDateRange(dateRange);
  };

  const resetDateRange = () => {
    setSelectedDateRange(getInitialDateRange());
  };

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-row">
          <div className="home-item">
            <Calendar onWeekSelect={handleWeekSelect} />
          </div>
          <div className="home-item">
            <HealthChart
              dataType="mood"
              period={14}
              customDateRange={selectedDateRange || undefined}
              onCustomDateRangeChange={handleCustomDateRangeChange}
            />
          </div>
        </div>
        <div className="home-row">
          <div className="home-item">
            <HealthChart
              dataType="temperature"
              period={14}
              customDateRange={selectedDateRange || undefined}
              onCustomDateRangeChange={handleCustomDateRangeChange}
            />
          </div>
          <div className="home-item">
            <HealthChart
              dataType="weight"
              period={14}
              customDateRange={selectedDateRange || undefined}
              onCustomDateRangeChange={handleCustomDateRangeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
