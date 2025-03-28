import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement);

export default function BudgetChart({ data, type, colors }) {
  const chartData = {
    labels: data.map(item => item.name || item.type),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: colors,
      borderWidth: 1
    }]
  };

  return (
    <div style={{ height: '300px' }}>
      {type === 'pie' ? (
        <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      ) : (
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      )}
    </div>
  );
}