import React, { useState, useEffect, useContext } from 'react';
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
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { setUpdateItem, garageParts, setGarageParts } = useContext(UserContext);

  // FIXED: Initialize displayedParts when garageParts loads
  useEffect(() => {
    if (garageParts.length > 0) {
      setDisplayedParts(garageParts);
      // Reset loading states when new data comes in
      setLoadedImages(new Set());
      setIsLoading(true); // Start loading images
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

  // Handle individual image load
  function handleImageLoad(itemId) {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);

      // Check if all images are loaded
      if (newSet.size >= displayedParts.length && displayedParts.length > 0) {
        setIsLoading(false);
      }

      return newSet;
    });
  }

  function deleteCard(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    axios.delete(`https://inventory-app-backend-production-75de.up.railway.app/api/garage-Parts/${id}`)
      .then(() => {
        const updatedGarageParts = garageParts.filter(item => item._id !== id);
        setGarageParts(updatedGarageParts);

        // Update displayed parts based on current search
        const filteredParts = searchItem
          ? updatedGarageParts.filter(p =>
            p.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            p.category.toLowerCase().includes(searchItem.toLowerCase())
          )
          : updatedGarageParts;

        setDisplayedParts(filteredParts);

        // Properly reset loading state
        setLoadedImages(new Set());
        if (filteredParts.length > 0) {
          setIsLoading(true); // Start loading images for remaining items
        } else {
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error("Error deleting item:", err);
        alert("Failed to delete the item. Please try again.");
        setIsLoading(false);
      });

    setSearchItem('');
  }

  function filterSearchedValue(value) {
    setSearchItem(value);

    const filtered = garageParts.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase()) ||
      p.category.toLowerCase().includes(value.toLowerCase())
    );

    setDisplayedParts(filtered);
    // Reset loading states for search
    setLoadedImages(new Set());
    if (filtered.length > 0) {
      setIsLoading(true); // Start loading images for filtered results
    } else {
      setIsLoading(false); // No items to load
    }
  }

  function handleEdit(id) {
    let item = displayedParts.find(card => card._id === id);
    setUpdateItem(item);
  }

  // Check loading completion when displayedParts or loadedImages change
  useEffect(() => {
    if (displayedParts.length > 0 && loadedImages.size >= displayedParts.length) {
      setIsLoading(false);
    }
  }, [displayedParts.length, loadedImages.size]);

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
            {/* Loading state for images - show when images are still loading */}
            {isLoading && displayedParts.length > 0 && (
              <div className='w-full bg-[#171717] py-8 flex items-center justify-center'>
                <div className='text-center text-white flex gap-4 items-center justify-center'>
                  <div className='text-2xl'><Loader /></div>
                  <div className='text-sm'>
                    Loading images... {loadedImages.size} / {displayedParts.length}
                  </div>
                </div>
              </div>
            )}

            {/* FIXED: Show loading only when garageParts is empty and we're waiting for data */}
            {garageParts.length === 0 && (
              <div className='text-center text-white text-xl py-20 flex items-center justify-center gap-4'>
                <Loader />
                <p>Loading items...</p>
              </div>
            )}

            {/* FIXED: Show "no items found" message properly */}
            {garageParts.length > 0 && displayedParts.length === 0 && searchItem && (
              <div className='text-center text-white text-xl py-20'>
                No items found for "{searchItem}"
              </div>
            )}

            {/* FIXED: Show "no items available" when no items exist at all */}
            {garageParts.length === 0 && displayedParts.length === 0 && !searchItem && (
              <div className='text-center text-white text-xl py-20'>
                No items available
              </div>
            )}

            {/* Cards Container - FIXED: Always show when there are items to display */}
            {displayedParts.length > 0 && (
              <div 
                className='columns-4 min-[1700px]:columns-6 max-[1280px]:columns-4 max-[1024px]:columns-3 max-[900px]:columns-2 max-[480px]:columns-1'
                style={{ opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.3s' }}
              >
                {displayedParts.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-md break-inside-avoid mb-4">
                    <img
                      className='min-w-full object-cover rounded-lg'
                      onLoad={() => handleImageLoad(item._id)}
                      onError={() => handleImageLoad(item._id)}
                      src={item.imageUrl || 'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png'}
                      alt={item.name}
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