import React, { useState, useEffect, useContext } from 'react';
import { MdOutlineDeleteOutline } from "react-icons/md";
import PopDownBox from './PopDownBox';
import UserContext from '../context/UserContext';
import axios from 'axios'


function MakeList() {
  const [popOut, setPopOut] = useState(false)
  const [message, setMessage] = useState('')
  const { garageParts, salesHistory, setSalesHistory, setGarageParts } = useContext(UserContext);
  useEffect(() => {
    setTimeout(() => {
      setPopOut(false)
    }, 1200);
  }, [salesHistory])

  const handleDeleteSale = async (saleId) => {
    const saleToDelete = salesHistory.find(sale => sale._id === saleId);
    if (!saleToDelete) return;

    try {
      await axios.delete(`https://inventory-app-backend-production-75de.up.railway.app/api/sales/${saleId}`)
      const updatedParts = garageParts.map(part => part._id === saleToDelete.partId ? { ...part, inventoryCount: part.inventoryCount + saleToDelete.quantitySold, sold: part.sold - saleToDelete.quantitySold, } : part)
      setGarageParts(updatedParts);
      setSalesHistory(salesHistory.filter(sale => sale._id !== saleId));
      setMessage('Sale Removed');
      setPopOut(true);
    } catch (error) {
      console.error('Error deleting sale:', err);
      alert('Failed to delete sale. Please try again.');
    }

    const updatedParts = garageParts.map(part =>
      part._id === saleToDelete.partId
        ? {
          ...part,
          inventoryCount: part.inventoryCount + saleToDelete.quantitySold,
          sold: part.sold - saleToDelete.quantitySold,
        }
        : part
    );
    setPopOut(true)
    setMessage('Sale Removed')
    setGarageParts(updatedParts);
    const deleteSale  =  salesHistory.filter(sale => sale._id !== saleId);
    setSalesHistory(deleteSale);
  };

  const handleClearAll = async () => {
    const confirm = window.confirm('Are you sure you want to clear all sales?');
    if (!confirm) return;
  
    try {
      await axios.delete('https://inventory-app-backend-production-75de.up.railway.app//api/sales'); // 🧠 Backend: DELETE all sales
  
      const restoredParts = garageParts.map(part => {
        const totalSold = salesHistory
          .filter(sale => sale.partId === part._id)
          .reduce((sum, sale) => sum + sale.quantitySold, 0);
  
        return {
          ...part,
          inventoryCount: part.inventoryCount + totalSold,
          sold: part.sold - totalSold,
        };
      });
  
      setGarageParts(restoredParts);
      setSalesHistory([]);
      setMessage("Sale list is cleared Successfully");
      setPopOut(true);
    } catch (err) {
      console.error('Error clearing sales:', err);
      alert('Failed to clear sales. Please try again.');
    }
  };
  

  const formatDate = (isoString) => new Date(isoString).toLocaleString();

  return (
    <div className='bg-[#171717] min-h-screen flex items-center justify-center'>
      {popOut &&
        <div className='absolute -top-5'>
          <PopDownBox text={message} />
        </div>
      }
      <div className="bg-white p-6 rounded-xl shadow-md w-[80%] min-lg:mt-12 max-sm:w-[92%] mx-auto  max-md:mb-0 mb-[10%]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Sale List</h3>
          <button
            onClick={handleClearAll}
            className="bg-red-400 text-white px-3 cursor-pointer py-1 rounded hover:bg-red-500"
          >
            Clear All
          </button>
        </div>

        {salesHistory.length === 0 ? (
          <p className="text-gray-800">No sales recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-sm font-medium mb-1 text-gray-700 ">Item Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-medium mb-1 text-gray-700">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-medium mb-1 text-gray-700">Total Bill (Rs)</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-medium mb-1 text-gray-700">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-medium mb-1 text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {salesHistory.map(sale => {
                  const part = typeof sale.partId === "object"
                  ? sale.partId
                  : garageParts.find(p => p._id === sale.partId);
                  const totalBill = sale.totalBill ?? (part?.sellingPrice ?? 0) * sale.quantitySold;

                  return (
                    <tr key={sale._id}>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">{part ? part.name : 'Deleted Part'}</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">{sale.quantitySold}</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">{totalBill}</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">{formatDate(sale.date)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">
                        <button
                          onClick={() => handleDeleteSale(sale._id)}
                          className="text-red-300 px-2 py-1 rounded-xl cursor-pointer flex items-center"
                        >
                          Delete <MdOutlineDeleteOutline className='size-4' />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MakeList;
