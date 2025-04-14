import React, { useState } from 'react';
import SalesGraph from './SalesGraph';
import CountUp from 'react-countup';

function Dashboard({ garageParts, salesHistory }) {
  const [showmore, setshowmore] = useState(false);
  const num = showmore ? 10 : 5;

  const totalInventory = garageParts.reduce((acc, part) => acc + part.inventoryCount, 0);
  const totalSales = salesHistory.reduce((acc, sale) => acc + sale.quantitySold, 0);

  const calculateRevenue = (sales) => {
    return sales.reduce((acc, sale) => {
      if (sale.totalBill !== null) {
        return acc + sale.totalBill;
      }
      const part = garageParts.find(p => p.id === sale.partId);
      return acc + (part ? part.sellingPrice * sale.quantitySold : 0);
    }, 0);
  };

  const totalRevenue = calculateRevenue(salesHistory);

  const recentSales = [...salesHistory].slice(-num).reverse();

  const getDateNDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const filterByDate = (sales, startDate) => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate;
    });
  };

  const last30DaysSales = filterByDate(salesHistory, getDateNDaysAgo(30));
  const last30DaysRevenue = calculateRevenue(last30DaysSales);

  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const daysToLastSunday = dayOfWeek === 0 ? 7 : dayOfWeek;
  const lastSunday = getDateNDaysAgo(daysToLastSunday);
  const thisWeekSales = filterByDate(salesHistory, lastSunday);
  const thisWeekRevenue = calculateRevenue(thisWeekSales);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaySales = filterByDate(salesHistory, todayStart);
  const todayRevenue = calculateRevenue(todaySales);

  return (
    <div className="p-6 flex flex-col gap-8 bg-[#171717] min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">Total Inventory</h2>
          <p className="text-2xl font-bold">{totalInventory} Items</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">Total Sales</h2>
          <p className="text-2xl font-bold">{totalSales} Sales</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">Revenue</h2>
          <p className="text-2xl font-bold">
            PKR <CountUp start={0} end={totalRevenue} duration={0.7} useEasing={false} preserveValue />
          </p>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Sales</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item Name</th>
                <th className="text-left py-2">Number Sold</th>
                <th className="text-left py-2">Total Bill Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => {
                const part = garageParts.find(p => p.id === sale.partId);
                const bill = sale.totalBill !== null ? sale.totalBill : (part?.sellingPrice || 0) * sale.quantitySold;
                return (
                  <tr key={sale.id} className="border-b">
                    <td className="py-2">{part?.name || "Unknown"}</td>
                    <td className="py-2">{sale.quantitySold}</td>
                    <td className="py-2">PKR {bill}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {
          salesHistory.length >= 10 &&
          <p className='cursor-pointer text-blue-300 underline' onClick={() => setshowmore(prev => !prev)}>
            {showmore ? "show less" : "show more"}...
          </p>
        }
      </div>

      {/* Revenue Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">Today's Revenue</h2>
          <p className="text-2xl font-bold">
            PKR <CountUp start={0} end={todayRevenue} duration={0.7} useEasing={false} preserveValue />
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">This Week Revenue</h2>
          <p className="text-2xl font-bold">
            PKR <CountUp start={0} end={thisWeekRevenue} duration={0.7} useEasing={false} preserveValue />
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">Last 30 Days Revenue</h2>
          <p className="text-2xl font-bold">
            PKR <CountUp start={0} end={last30DaysRevenue} duration={0.7} useEasing={false} preserveValue />
          </p>
        </div>
      </div>

      {/* Sales Graph */}
      <div>
        <div className='max-w-[100%]'>
          <SalesGraph salesHistory={salesHistory} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
