import { useState } from "react";

interface UsePeriodNavigationProps {
  period: number;
  customDateRange?: {
    startDate: Date;
    endDate: Date;
  };
  onCustomDateRangeChange?: (
    dateRange: { startDate: Date; endDate: Date } | null
  ) => void;
}

export const usePeriodNavigation = ({
  period,
  customDateRange,
  onCustomDateRangeChange,
}: UsePeriodNavigationProps) => {
  const [currentOffset, setCurrentOffset] = useState(0);

  const getCurrentPeriodLength = () => {
    if (customDateRange) {
      const { startDate, endDate } = customDateRange;
      const timeDiff = endDate.getTime() - startDate.getTime();
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    }
    return period;
  };

  const goToPreviousPeriod = () => {
    if (customDateRange && onCustomDateRangeChange) {
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

  const goToNextPeriod = () => {
    if (customDateRange && onCustomDateRangeChange) {
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

  return {
    currentOffset,
    goToPreviousPeriod,
    goToNextPeriod,
    getCurrentPeriodLabel,
  };
};