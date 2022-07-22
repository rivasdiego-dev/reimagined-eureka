/* eslint-disable */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Chart = ({ posts, exchanges, titles }) => {
  const chartData = {
    labels: titles,
    datasets: [
      {
        label: 'Posts by month',
        data: posts,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Finished projects by month',
        data: exchanges,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default Chart;
