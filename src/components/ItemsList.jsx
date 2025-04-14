import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiBox } from "react-icons/fi";
import { FaTag } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { CiCreditCardOff } from "react-icons/ci";
import { RiDeleteBin6Fill } from "react-icons/ri";

function ItemsList({ garageParts, setGarageParts }) {
  const [displayedParts, setDisplayedParts] = useState([]);
  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
    setDisplayedParts(shuffleArray(garageParts));
  }, [garageParts]);

  function shuffleArray(arr) {
    const copied = [...arr];
    for (let i = copied.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
  }

  function deleteCard(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    const updatedGarageParts = garageParts.filter(item => item.id !== id);
    setGarageParts(updatedGarageParts);
    setDisplayedParts(updatedGarageParts);
  }

  function filterSearchedValue(value) {
    setSearchItem(value);
    const filtered = garageParts.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase()) ||
      p.category.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedParts(filtered);
  }

  return (
    <div className='p-4 bg-[#171717] min-h-screen'>
      <div className='flex flex-col gap-10'>
        <div className='w-full flex justify-center relative'>
          <input
            className='w-[90%] md:w-[60%] lg:w-[50%] px-3 py-1 text-lg rounded-lg bg-white/40 text-white outline-none border-white/40 border-[1px] pr-10'
            type="text"
            value={searchItem}
            onChange={(e) => filterSearchedValue(e.target.value)}
            placeholder='Type to search'
          />
          <div className='absolute right-[5%] md:right-[20%] lg:right-[25%] top-1/2 -translate-y-1/2 rounded-lg cursor-pointer bg-white p-1'>
            <IoSearchSharp className='size-7' />
          </div>
        </div>

        <div className='columns-4 min-[1700px]:columns-6 max-[1280px]:columns-4 max-[1024px]:columns-3 max-[900px]:columns-2 max-[480px]:columns-1'>
          {displayedParts.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md break-inside-avoid mb-4">
              <img className='min-w-full object-cover rounded-md' src={item.imageUrl || 'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png'} alt={item.name} />
              <div className='px-3 pb-3'>
                <div className='flex flex-wrap items-start justify-between py-2'>
                  <div>
                    <h2 className='text-lg font-semibold'>{item.name}</h2>
                    <p className="flex items-center text-sm text-gray-600">
                      <FaTag className="mr-1 text-gray-600" /> {item.category}
                    </p>
                  </div>
                  <div className='flex flex-col items-end'>
                    <p> <span className='text-md font-semibold'>Price:</span> RS.{item.sellingPrice}</p>
                    <div className='flex flex-wrap'>
                    <h2 className='text-md font-semibold'>Retail:</h2>
                    <p className="flex items-center text-sm">RS.{item.retailPrice}</p>
                  </div>
                  </div>
                </div>

                <div className='flex items-center flex-col text-center gap-3 justify-around mb-3'>
                  <h1 className='text-md font-bold'>Inventory</h1>
                  <div className='flex gap-2'>
                <p className="flex items-center text-sm  border-r-1 pr-2">
                      <FiShoppingCart className="mr-1" />
                      <span className="font-medium">Sold:</span> {item.sold}
                    </p>
                  <div >
                    <p className="flex items-center text-sm">
                      <FiBox className="mr-1" />
                      <span className="font-medium">Stock:</span> {item.inventoryCount}
                    </p>
                  </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-emerald-600 shadow-sm transition-all duration-200"
                    title="Mark as Paid"
                  >
                    <CiCreditCardOff className="size-5" />
                  </button>

                  <button
                    onClick={() => deleteCard(item.id)}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-[#db4439] shadow-sm transition-all duration-200"
                    title="Delete Item"
                  >
                    <RiDeleteBin6Fill className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemsList;
