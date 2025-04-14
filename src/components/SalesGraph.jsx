import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components
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

// Helper to get the date N days ago
const getDateNDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

function SalesGraph({ salesHistory = [] }) {
  if (!Array.isArray(salesHistory)) {
    console.error("Invalid salesHistory data. Expected an array.");
    return <div>Error: Sales history data is missing or invalid.</div>;
  }

  const groupSalesByDate = (sales, daysAgo) => {
    const salesGrouped = {};
    const startDate = getDateNDaysAgo(daysAgo);

    sales.forEach((sale) => {
      const saleDate = new Date(sale.date);
      if (saleDate >= startDate) {
        const dateKey = saleDate.toISOString().split('T')[0];
        salesGrouped[dateKey] = (salesGrouped[dateKey] || 0) + sale.quantitySold;
      }
    });

    return salesGrouped;
  };

  const groupSalesByHour = (sales) => {
    const salesGrouped = new Array(24).fill(0);
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
    sales.forEach((sale) => {
      const saleDateUTC = new Date(sale.date); // stored in ISO/UTC
      const localDate = new Date(
        saleDateUTC.getUTCFullYear(),
        saleDateUTC.getUTCMonth(),
        saleDateUTC.getUTCDate(),
        saleDateUTC.getUTCHours(),
        saleDateUTC.getUTCMinutes(),
        saleDateUTC.getUTCSeconds()
      );
  
      // check if sale is today in local time
      if (
        localDate.getDate() === today.getDate() &&
        localDate.getMonth() === today.getMonth() &&
        localDate.getFullYear() === today.getFullYear()
      ) {
        const hour = localDate.getHours();
        salesGrouped[hour] += sale.quantitySold;
      }
    });
  
    return salesGrouped;
  };
  

  const last30DaysSales = groupSalesByDate(salesHistory, 30);
  const last7DaysSales = groupSalesByDate(salesHistory, 7);
  const salesPerHourToday = groupSalesByHour(salesHistory);

  const chartDataLast30Days = {
    labels: Object.keys(last30DaysSales),
    datasets: [
      {
        label: 'Sales (Last 30 Days)',
        data: Object.values(last30DaysSales),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
      },
    ],
  };

  const chartDataLast7Days = {
    labels: Object.keys(last7DaysSales),
    datasets: [
      {
        label: 'Sales (Last 7 Days)',
        data: Object.values(last7DaysSales),
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: false,
      },
    ],
  };

  const chartDataToday = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Sales (Today)',
        data: salesPerHourToday,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white p-3 rounded-2xl">
      <h2 className="text-xl font-bold mb-4 text-center">Sales Graphs</h2>

      <div className="flex max-lg:flex-col w-full gap-4">
        <div className="mb-8 bg-white min-w-[33%] max-lg:w-full" style={{ overflowX: 'auto' }}>
          <h3 className="text-lg font-semibold mb-2">Sales in the Last 24 Hours</h3>
          <Bar data={chartDataToday} options={{ responsive: true }} />
        </div>

        <div className="mb-8 bg-white min-w-[33%] max-lg:w-full" style={{ overflowX: 'auto' }}>
          <h3 className="text-lg font-semibold mb-2">Sales in Last 7 Days</h3>
          <Line data={chartDataLast7Days} options={{ responsive: true }} />
        </div>

        <div className="mb-8 bg-white min-w-[33%] max-lg:w-full" style={{ overflowX: 'auto' }}>
          <h3 className="text-lg font-semibold mb-2">Sales in Last 30 Days</h3>
          <Line data={chartDataLast30Days} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

export default SalesGraph;
