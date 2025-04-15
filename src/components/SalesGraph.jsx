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
    today.setHours(0, 0, 0, 0);
    
    sales.forEach((sale) => {
      const saleDate = new Date(sale.date);
      if (saleDate >= today) {
        const hour = saleDate.getHours(); 
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
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sales Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Today's Sales by Hour</h3>
          <div className="h-64">
            <Bar 
              data={chartDataToday} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Quantity Sold'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Hour of Day'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Last 7 Days Sales</h3>
          <div className="h-64">
            <Line 
              data={chartDataLast7Days} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Quantity Sold'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Last 30 Days Sales</h3>
          <div className="h-64">
            <Line 
              data={chartDataLast30Days} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Quantity Sold'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesGraph;