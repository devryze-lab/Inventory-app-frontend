import React, { useState, useContext } from 'react';
import SalesGraph from './SalesGraph';
import CountUp from 'react-countup';
import { FiShoppingCart } from "react-icons/fi";
import { RiBox3Line } from "react-icons/ri";
import { AiOutlineDollar } from "react-icons/ai";
import { GoSun } from "react-icons/go";
import { TbCalendarWeekFilled } from "react-icons/tb";
import { TbCalendarMonth } from "react-icons/tb";
import UserContext from '../context/UserContext';


function Dashboard() {
  const { garageParts, salesHistory } = useContext(UserContext)
  const [showmore, setshowmore] = useState(false);
  const num = showmore ? 10 : 5;

  const totalInventory = garageParts.reduce((acc, part) => acc + part.inventoryCount, 0);
  const totalSales = salesHistory.reduce((acc, sale) => acc + sale.quantitySold, 0);

  const calculateRevenue = (sales) => {
    return sales.reduce((acc, sale) => {
      if (sale.totalBill !== null) {
        return acc + sale.totalBill;
      }
      const part = garageParts.find(p => p._id === sale.partId);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 flex items-baseline-last justify-between">
          <div>
            <h2 className="text-gray-500 text-sm">Total Inventory</h2>
            <p className="text-2xl font-bold text-gray-700">{totalInventory} Items</p>
          </div>
          <div className='bg-blue-50 p-3 rounded-full'>
            <RiBox3Line className='size-6 text-blue-400 ' />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-baseline-last justify-between">
          <div>
            <h2 className="text-gray-500 text-sm">Total Sales</h2>
            <p className="text-2xl font-bold text-gray-700">{totalSales} Sales</p>
          </div>
          <div className='bg-green-50 p-3 rounded-full'>
            <FiShoppingCart className='size-6 text-emerald-500 ' />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-baseline-last justify-between">
          <div>
            <h2 className="text-gray-500 text-sm">Revenue</h2>
            <p className="text-2xl font-bold text-gray-700">
              PKR <CountUp start={0} end={totalRevenue} duration={0.7} useEasing={false} preserveValue />
            </p>
          </div>
          <div className='bg-yellow-100 p-3 rounded-full'>
            <AiOutlineDollar className='size-6 text-yellow-600 ' />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Sales</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 text-gray-500 text-[15px]">Item Name</th>
                <th className="text-left py-2 text-gray-500 text-[15px]">Number Sold</th>
                <th className="text-left py-2 text-gray-500 text-[15px]">Total Bill Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => {
                const part = typeof sale.partId === "object"
                  ? sale.partId
                  : garageParts.find(p => p._id === sale.partId);

                const bill = sale.totalBill !== null
                  ? sale.totalBill
                  : (part?.sellingPrice || 0) * sale.quantitySold;

                return (
                  <tr key={sale._id} className="border-b border-gray-300">
                    <td className="py-2 text-gray-500 text-sm">{part?.name || "Unknown"}</td>
                    <td className="py-2 text-gray-500 text-sm">{sale.quantitySold}</td>
                    <td className="py-2 text-gray-500 text-sm">PKR {bill}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {
          salesHistory.length >= 10 &&
          <p className='cursor-pointer text-blue-600 mt-2 w-fit underline' onClick={() => setshowmore(prev => !prev)}>
            {showmore ? "show less" : "show more"}...
          </p>
        }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 flex items-baseline-last justify-between">
          <div>
            <h2 className="text-gray-500 text-sm ">Today's Revenue</h2>
            <p className="text-2xl font-bold text-gray-700">
              PKR <CountUp start={0} end={todayRevenue} duration={0.7} useEasing={false} preserveValue />
            </p>
          </div>
          <div className='bg-yellow-100 p-3 rounded-full'>
            <GoSun className='size-6 text-yellow-600 ' />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-baseline-last justify-between">
          <div>
            <h2 className="text-gray-500 text-sm">This Week Revenue</h2>
            <p className="text-2xl font-bold text-gray-700">
              PKR <CountUp start={0} end={thisWeekRevenue} duration={0.7} useEasing={false} preserveValue />
            </p>
          </div>
          <div className='bg-purple-100 p-3 rounded-full'>
            <TbCalendarWeekFilled className='size-6 text-purple-600 ' />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-baseline-last justify-between">
          <div>
            <h2 className="text-gray-500 text-sm">Last 30 Days Revenue</h2>
            <p className="text-2xl font-bold text-gray-700">
              PKR <CountUp start={0} end={last30DaysRevenue} duration={0.7} useEasing={false} preserveValue />
            </p>
          </div>
          <div className='bg-emerald-50 p-3 rounded-full'>
            <TbCalendarMonth className='size-6 text-[#5fc1c1] ' />
          </div>
        </div>
      </div>

      <div>
        <div className='max-w-[100%]'>
          <SalesGraph salesHistory={salesHistory} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
