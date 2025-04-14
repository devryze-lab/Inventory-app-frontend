import React, { useState } from 'react';

function MakeSale({ garageParts, setGarageParts, salesHistory, setSalesHistory }) {
  const dateToday = new Date()
  const [selectedPartId, setSelectedPartId] = useState('');
  const [quantitySold, setQuantitySold] = useState('');
  const [date, setDate] = useState(dateToday);
  const [customBill, setCustomBill] = useState('');

  const handleAddSale = (e) => {
    e.preventDefault();
    const part = garageParts.find(p => p.id === Number(selectedPartId));
    if (!part || !quantitySold || !date) {
      alert('Please select a part, quantity, and date.');
      return;
    }

    const autoBill = part.sellingPrice * Number(quantitySold);
    const totalBill = customBill ? Number(customBill) : autoBill;

    const newSale = {
      id: Date.now(),
      partId: part.id,
      quantitySold: Number(quantitySold),
      date: new Date(date).toISOString(),
      totalBill,
    };

    const updatedParts = garageParts.map(p =>
      p.id === part.id
        ? {
          ...p,
          inventoryCount: p.inventoryCount - Number(quantitySold),
          sold: p.sold + Number(quantitySold),
        }
        : p
    );

    setGarageParts(updatedParts);
    setSalesHistory([...salesHistory, newSale]);

    setSelectedPartId('');
    setQuantitySold('');
    setDate('');
    setCustomBill('');
  };

  return (
    <div className='flex items-center justify-center bg-[#171717]  h-screen'>
      <div className="bg-white p-6 rounded-xl shadow-md  w-[80%] max-sm:w-[90%] max-md:mb-[28%] mb-[10%]">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Make Sale</h2>
      <p className="text-gray-600 mb-6">Fill in the details below to make a sale.</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Part</label>
          <select
            className="w-full px-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
            value={selectedPartId}
            onChange={e => setSelectedPartId(e.target.value)}
          >
            <option value="">-- Select a part --</option>
            {garageParts.map(part => (
              <option key={part.id} value={part.id}>
                {part.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Sold</label>
          <input
            type="number"
            className="w-full px-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
            value={quantitySold}
            onChange={e => setQuantitySold(e.target.value)}
            placeholder="Enter quantity"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 ">Sale Date</label>
          <input
            type="datetime-local"
            className="w-full px-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Bill (optional)</label>
          <input
            type="number"
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
            value={customBill}
            onChange={e => setCustomBill(e.target.value)}
            placeholder="Enter custom bill or leave blank"
          />
        </div>

        <div className="mb-4 font-semibold text-gray-700">
          {selectedPartId && quantitySold && (
            <>
              Auto Total Bill:&nbsp;
              <span className="text-green-600">
                Rs {garageParts.find(p => p.id === Number(selectedPartId)).sellingPrice * Number(quantitySold)}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          className="bg-black/80 cursor-pointer text-white px-4 py-2 rounded hover:bg-black w-full"
          onClick={handleAddSale}
        >
          Add Sale
        </button>
      </div>
    </div>
  );
}

export default MakeSale;
