import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { FC } from "react";

Chart.register(ArcElement, Tooltip, Legend);

interface EmotionChartProps {
  data: Record<string, number>;
}

export const EmotionChart: FC<EmotionChartProps> = ({ data }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        hoverBackgroundColor: colors.slice(0, labels.length),
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">情緒分析</h3>
      <Pie data={chartData} />
    </div>
  );
};
