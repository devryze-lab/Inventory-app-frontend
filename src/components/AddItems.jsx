import React, { useState, useRef, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import PopDownBox from './PopDownBox';
import axios from 'axios';
import Spinner from './spinner/Spinner';

function AddPartForm() {
  const { updateItem, setUpdateItem, garageParts, setGarageParts } = useContext(UserContext);
  const [popOut, setPopout] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    inventoryCount: '',
    retailPrice: '',
    sellingPrice: '',
    sold: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  function resetForm() {
    setFormData({ name: '', category: '', inventoryCount: '', retailPrice: '', sellingPrice: '', sold: '' });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    setUpdateItem(null);
  }

  useEffect(() => {
    if (updateItem) {
      setFormData({
        name: updateItem.name || '',
        category: updateItem.category || '',
        inventoryCount: updateItem.inventoryCount || '',
        retailPrice: updateItem.retailPrice || '',
        sellingPrice: updateItem.sellingPrice || '',
        sold: updateItem.sold || ''
      });
    }
  }, [updateItem]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['sold', 'inventoryCount', 'retailPrice', 'sellingPrice'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('category', formData.category);
      fd.append('inventoryCount', formData.inventoryCount);
      fd.append('retailPrice', formData.retailPrice);
      fd.append('sellingPrice', formData.sellingPrice);
      fd.append('sold', formData.sold);
      
      if (selectedFile) {
        console.log('=== DEBUG: File being uploaded ===');
        console.log('File name:', selectedFile.name);
        console.log('File type:', selectedFile.type);
        console.log('File size:', selectedFile.size);
        fd.append('image', selectedFile);
      }
  
      let res;
      if (updateItem) {
        res = await axios.put(
          `https://inventory-app-backend-uf6l.onrender.com/api/garage-parts/${updateItem._id}`,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setGarageParts(garageParts.map(p => p._id === updateItem._id ? res.data : p));
      } else {
        res = await axios.post(
          'https://inventory-app-backend-uf6l.onrender.com/api/garage-parts',
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setGarageParts([...garageParts, res.data]);
      }
  
      // DEBUG: Check what backend returns
      console.log('=== DEBUG: Backend Response ===');
      console.log('Full response:', res.data);
      console.log('Image URL:', res.data.imageUrl);
      console.log('Image field:', res.data.image);
      console.log('All response keys:', Object.keys(res.data));
      console.log('=== END DEBUG ===');
  
      setPopout(true);
      setTimeout(() => setPopout(false), 1000);
      resetForm();
    } catch (err) {
      console.error('Error submitting form:', err);
      console.error('Error response:', err.response?.data);
      alert('There was a problem saving the part. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-4 bg-[#171717] min-h-screen flex items-center justify-center'>
      {popOut && (
        <div className='absolute -top-5'>
          <PopDownBox text={updateItem ? 'Item Updated Successfully' : 'Item Added Successfully'} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg space-y-5 w-[80%] max-md:w-[95%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add/Update Inventory Item</h2>
        <p className="text-gray-600 mb-6">Fill in the details below to add or update an item</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
              placeholder="Part name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
              placeholder="Item category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Count*</label>
            <input
              type="number"
              name="inventoryCount"
              value={formData.inventoryCount}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
              placeholder="Available quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sold Quantity</label>
            <input
              type="number"
              name="sold"
              value={formData.sold}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
              placeholder="Quantity sold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price*</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">PKR</span>
              <input
                type="number"
                name="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                required
                min="0"
                step="1"
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price*</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">PKR</span>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                required
                min="0"
                step="1"
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-full py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <span className="text-sm text-gray-600">
                  {selectedFile ? 'Change image' : 'Click to upload image'}
                </span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</span>
              </label>
            </div>
            {selectedFile && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="max-h-40 object-contain rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#171717] text-white rounded-lg hover:bg-[black] cursor-pointer transition-colors font-medium"
          >
            {isLoading ? <Spinner/> :updateItem ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPartForm;
