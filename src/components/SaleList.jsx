import React from 'react';
import { MdOutlineDeleteOutline } from "react-icons/md";


function MakeList({ garageParts, salesHistory, setSalesHistory, setGarageParts }) {
  const handleDeleteSale = (saleId) => {
    const saleToDelete = salesHistory.find(sale => sale.id === saleId);

    const updatedParts = garageParts.map(part =>
      part.id === saleToDelete.partId
        ? {
            ...part,
            inventoryCount: part.inventoryCount + saleToDelete.quantitySold,
            sold: part.sold - saleToDelete.quantitySold,
          }
        : part
    );

    setGarageParts(updatedParts);
    setSalesHistory(salesHistory.filter(sale => sale.id !== saleId));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all sales?')) {
      const restoredParts = garageParts.map(part => {
        const totalSold = salesHistory
          .filter(sale => sale.partId === part.id)
          .reduce((sum, sale) => sum + sale.quantitySold, 0);

        return {
          ...part,
          inventoryCount: part.inventoryCount + totalSold,
          sold: part.sold - totalSold,
        };
      });

      setGarageParts(restoredParts);
      setSalesHistory([]);
    }
  };

  const formatDate = (isoString) => new Date(isoString).toLocaleString();

  return (
    <div className='bg-[#171717] min-h-screen flex items-center justify-center'>
      <div className="bg-white p-6 rounded-xl shadow-md w-[80%] max-sm:w-[95%] mx-auto">
        {/* Sale List Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Sale List</h3>
          <button
            onClick={handleClearAll}
            className="bg-red-400 text-white px-3 cursor-pointer py-1 rounded hover:bg-red-500"
          >
            Clear All
          </button>
        </div>

        {salesHistory.length === 0 ? (
          <p className="text-gray-500">No sales recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Item Name</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Total Bill (Rs)</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {salesHistory.map(sale => {
                  const part = garageParts.find(p => p.id === sale.partId);
                  const totalBill = sale.totalBill ?? (part?.sellingPrice ?? 0) * sale.quantitySold;

                  return (
                    <tr key={sale.id}>
                      <td className="border px-4 py-2">{part ? part.name : 'Deleted Part'}</td>
                      <td className="border px-4 py-2">{sale.quantitySold}</td>
                      <td className="border px-4 py-2">{totalBill}</td>
                      <td className="border px-4 py-2">{formatDate(sale.date)}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDeleteSale(sale.id)}
                          className="text-red-400 px-2 py-1 rounded cursor-pointer flex items-center"
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
