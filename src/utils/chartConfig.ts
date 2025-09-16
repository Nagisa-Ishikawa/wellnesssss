import { AppSettings } from "../types";

type DataType = "mood" | "temperature" | "weight" | "heartRate";

export const getChartTitle = (dataType: DataType): string => {
  switch (dataType) {
    case "mood":
      return "気分";
    case "temperature":
      return "体温";
    case "weight":
      return "体重";
    case "heartRate":
      return "心拍数";
    default:
      return "";
  }
};

export const getYAxisLabel = (dataType: DataType): string => {
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

export const getChartColors = (dataType: DataType) => {
  return {
    borderColor: dataType === "mood" ? "rgb(255, 99, 132)" : "rgb(53, 162, 235)",
    backgroundColor:
      dataType === "mood"
        ? "rgba(255, 99, 132, 0.5)"
        : "rgba(53, 162, 235, 0.5)",
  };
};

export const createChartData = (
  dates: string[],
  data: (number | null)[],
  dataType: DataType
) => {
  const colors = getChartColors(dataType);

  return {
    labels: dates,
    datasets: [
      {
        label: getYAxisLabel(dataType),
        data: data,
        borderColor: colors.borderColor,
        backgroundColor: colors.backgroundColor,
        tension: 0.1,
        spanGaps: true,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHitRadius: 15,
      },
    ],
  };
};

export const createChartOptions = (
  dataType: DataType,
  settings: AppSettings | null,
  onChartClick?: (event: any, elements: any[], chart: any) => void
) => {
  return {
    responsive: true,
    interaction: {
      intersect: false,
      mode: "point" as const,
    },
    onClick: onChartClick,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: getChartTitle(dataType),
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: getYAxisLabel(dataType),
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
        ...(dataType === "weight" &&
          settings && {
            min: settings.chartRanges.weight.min,
            max: settings.chartRanges.weight.max,
          }),
        ...(dataType === "temperature" &&
          settings && {
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
};