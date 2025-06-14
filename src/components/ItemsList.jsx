import React, { useState, useEffect, useContext, useRef } from 'react';
import { FiShoppingCart, FiBox } from "react-icons/fi";
import { FaTag } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { RiEditBoxFill } from "react-icons/ri";
import { RiDeleteBin6Fill } from "react-icons/ri";
import UserContext from '../context/UserContext';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import Loader from './loader/Loader';

function ItemsList() {
  const [displayedParts, setDisplayedParts] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setUpdateItem, garageParts, setGarageParts } = useContext(UserContext);
  
  // Track if we've already done initial setup
  const hasInitialized = useRef(false);

  // Initialize displayedParts when garageParts loads for the first time
  useEffect(() => {
    if (garageParts.length > 0 && !hasInitialized.current) {
      setDisplayedParts(garageParts);
      setIsInitialLoading(false);
      hasInitialized.current = true;
    } else if (garageParts.length === 0 && hasInitialized.current) {
      // Handle case where all items are deleted
      setDisplayedParts([]);
      setIsInitialLoading(false);
    }
  }, [garageParts]);

  function shuffleArray(arr) {
    const copied = [...arr];
    for (let i = copied.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
  }

  async function deleteCard(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      await axios.delete(`https://inventory-app-backend-uf6l.onrender.com/api/garage-Parts/${id}`);
      
      const updatedGarageParts = garageParts.filter(item => item._id !== id);
      setGarageParts(updatedGarageParts);

      // Update displayed parts based on current search - no loading needed
      const filteredParts = searchItem
        ? updatedGarageParts.filter(p =>
            p.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            p.category.toLowerCase().includes(searchItem.toLowerCase())
          )
        : updatedGarageParts;

      setDisplayedParts(filteredParts);
      
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete the item. Please try again.");
    } finally {
      setIsDeleting(false);
    }

    setSearchItem('');
  }

  function filterSearchedValue(value) {
    setSearchItem(value);

    // Instant filtering - no loading needed since data is already available
    const filtered = garageParts.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase()) ||
      p.category.toLowerCase().includes(value.toLowerCase())
    );

    setDisplayedParts(filtered);
  }

  function handleEdit(id) {
    let item = displayedParts.find(card => card._id === id);
    setUpdateItem(item);
  }

  return (
    <>
      <div className='p-4 bg-[#171717] min-h-screen pb-20 md:pb-4'>
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

          <div>
            {/* Show loading only during initial data load */}
            {isInitialLoading && (
              <div className='text-center text-white text-xl py-20 flex items-center justify-center gap-4'>
                <Loader />
                <p>Loading items...</p>
              </div>
            )}

            {/* Show deleting state */}
            {isDeleting && (
              <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-lg p-6 flex items-center gap-4'>
                  <Loader />
                  <p className='text-gray-700'>Deleting item...</p>
                </div>
              </div>
            )}

            {/* Show "no items found" message for search results */}
            {!isInitialLoading && garageParts.length > 0 && displayedParts.length === 0 && searchItem && (
              <div className='text-center text-white text-xl py-20'>
                <div className='mb-4'>🔍</div>
                <p>No items found for "{searchItem}"</p>
                <button 
                  onClick={() => {
                    setSearchItem('');
                    setDisplayedParts(garageParts);
                  }}
                  className='mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all'
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Show "no items available" when no items exist at all */}
            {!isInitialLoading && garageParts.length === 0 && (
              <div className='text-center text-white text-xl py-20'>
                <div className='mb-4'>📦</div>
                <p>No items available</p>
                <p className='text-sm text-white/70 mt-2'>Add your first item to get started</p>
              </div>
            )}

            {/* Cards Container - Show immediately when items are available */}
            {!isInitialLoading && displayedParts.length > 0 && (
              <div className='columns-4 min-[1700px]:columns-6 max-[1280px]:columns-4 max-[1024px]:columns-3 max-[900px]:columns-2 max-[480px]:columns-1'>
                {displayedParts.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-md break-inside-avoid mb-4 hover:shadow-lg transition-shadow duration-200">
                    <img
                      className='min-w-full object-cover rounded-lg'
                      src={item.imageUrl || 'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png'}
                      alt={item.name}
                      loading="lazy" // Enable lazy loading for better performance
                      onError={(e) => {
                        e.target.src = 'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png';
                      }}
                    />
                    <div className='px-3 pb-3'>
                      <div className='flex flex-wrap items-start justify-between py-2'>
                        <div>
                          <h2 className='text-lg font-semibold text-gray-700'>{item.name}</h2>
                          <p className="flex items-center text-sm text-gray-700">
                            <FaTag className="mr-1 text-gray-700" /> {item.category}
                          </p>
                        </div>
                        <div className='flex flex-col items-end'>
                          <p className='text-sm text-gray-500'>
                            <span className='text-sm font-semibold'>Price:</span> RS.{item.sellingPrice}
                          </p>
                          <div className='flex flex-wrap'>
                            <h2 className='text-sm text-gray-500 font-semibold'>Retail:</h2>
                            <p className="flex items-center text-sm text-gray-500">RS.{item.retailPrice}</p>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center flex-col text-center gap-3 justify-around mb-3'>
                        <h1 className='text-md font-bold text-gray-600'>Inventory</h1>
                        <div className='flex gap-2'>
                          <p className="flex items-center text-sm text-gray-500 border-r-1 border-gray-300 pr-2">
                            <FiShoppingCart className="mr-1" />
                            <span className="font-medium">Sold:</span> {item.sold}
                          </p>
                          <div>
                            <p className="flex items-center text-sm text-gray-500">
                              <FiBox className="mr-1" />
                              <span className="font-medium">Stock:</span> {item.inventoryCount}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 mt-2">
                        <NavLink
                          to='/addItems'
                          className={({ isActive }) =>
                            `flex items-center cursor-pointer duration-700 rounded ${isActive ? 'bg-white/30 text-white font-semibold' : 'text-white hover:bg-white/20'
                            }`
                          }
                        >
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-emerald-600 shadow-sm transition-all duration-200"
                            title="Edit Item"
                          >
                            <RiEditBoxFill className="size-5" />
                          </button>
                        </NavLink>

                        <button
                          onClick={() => deleteCard(item._id)}
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-[#db4439] shadow-sm transition-all duration-200"
                          title="Delete Item"
                          disabled={isDeleting}
                        >
                          <RiDeleteBin6Fill className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemsList;