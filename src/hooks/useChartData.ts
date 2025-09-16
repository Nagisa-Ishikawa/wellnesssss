import { useState, useEffect } from "react";
import { getAllRecords, getSettings } from "../utils/storage";
import { HealthRecord, MoodLevel, AppSettings } from "../types";

interface UseChartDataProps {
  dataType: "mood" | "temperature" | "weight" | "heartRate";
  period: number;
  customDateRange?: {
    startDate: Date;
    endDate: Date;
  };
  currentOffset: number;
}

export const useChartData = ({
  dataType,
  period,
  customDateRange,
  currentOffset,
}: UseChartDataProps) => {
  const [records, setRecords] = useState<Record<string, HealthRecord>>({});
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [recordsData, settingsData] = await Promise.all([
        getAllRecords(),
        getSettings(),
      ]);
      setRecords(recordsData);
      setSettings(settingsData);
    };
    loadData();
  }, []);

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

  const getData = () => {
    const dates: string[] = [];
    const dateStrings: string[] = [];
    const data: (number | null)[] = [];

    if (customDateRange) {
      const { startDate, endDate } = customDateRange;
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        dateStrings.push(dateString);
        dates.push(
          currentDate.toLocaleDateString("ja-JP", {
            month: "numeric",
            day: "numeric",
          })
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
      const today = new Date();
      for (let i = period - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i - currentOffset);
        const dateString = date.toISOString().split("T")[0];
        dateStrings.push(dateString);
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

    return { dates, dateStrings, data };
  };

  return {
    records,
    settings,
    getData,
    getMoodValue,
  };
};