import React from "react";
import { HealthRecord, MoodLevel } from "../types";
import { getYAxisLabel } from "../utils/chartConfig";

interface ChartTooltipProps {
  tooltip: {
    show: boolean;
    x: number;
    y: number;
    date: string;
  } | null;
  records: Record<string, HealthRecord>;
  dataType: "mood" | "temperature" | "weight" | "heartRate";
  onEditClick: () => void;
  onClose: () => void;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  tooltip,
  records,
  dataType,
  onEditClick,
  onClose,
}) => {
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

  const getValueDisplay = () => {
    if (!tooltip) return "未記録";

    const record = records[tooltip.date];
    if (record) {
      switch (dataType) {
        case "mood":
          const moodLabels = {
            1: "悪い",
            2: "やや悪い",
            3: "普通",
            4: "やや良い",
            5: "良い",
          };
          return (
            moodLabels[
              getMoodValue(record.mood) as keyof typeof moodLabels
            ] || "未記録"
          );
        case "temperature":
          return record.temperature ? `${record.temperature}°C` : "未記録";
        case "weight":
          return record.weight ? `${record.weight}kg` : "未記録";
        case "heartRate":
          return record.heartRate ? `${record.heartRate}bpm` : "未記録";
        default:
          return "未記録";
      }
    }
    return "未記録";
  };

  if (!tooltip || !tooltip.show) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: tooltip.x - 50,
          top: tooltip.y - 50,
          backgroundColor: "rgba(71, 85, 105, 0.95)",
          color: "white",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          padding: "0",
          zIndex: 1000,
          fontSize: "12px",
          minWidth: "100px",
          maxWidth: "200px",
          animation: "tooltipFadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            width: "8px",
            height: "8px",
            backgroundColor: "rgba(71, 85, 105, 0.95)",
            transform: "translateX(-50%) rotate(45deg)",
          }}
        />

        <div
          style={{
            padding: "4px 10px",
            fontSize: "12px",
            gap: "6px",
            display: "flex",
            flexDirection: "column",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {new Date(tooltip.date).toLocaleDateString("ja-JP", {
            month: "numeric",
            day: "numeric",
          })}
          <div>
            {getYAxisLabel(dataType)}: {getValueDisplay()}
          </div>
        </div>

        <button
          onClick={onEditClick}
          style={{
            width: "100%",
            padding: "8px 10px",
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span style={{ fontSize: "10px" }}>✏️</span>
          編集
        </button>
      </div>

      <style>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default ChartTooltip;