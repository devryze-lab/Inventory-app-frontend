import React, { useState, useRef, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';

function AddPartForm({ garageParts, setGarageParts }) {
  const { updateItem, setUpdateItem } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    inventoryCount: 0,
    retailPrice: 0,
    sellingPrice: 0,
    imageUrl: '',
    sold: 0
  });

  const fileInputRef = useRef();

  useEffect(() => {
    if (updateItem) {
      setFormData({
        name: updateItem.name ?? '',
        category: updateItem.category ?? '',
        inventoryCount: updateItem.inventoryCount ?? 0,
        retailPrice: updateItem.retailPrice ?? 0,
        sellingPrice: updateItem.sellingPrice ?? 0,
        imageUrl: updateItem.imageUrl ?? '',
        sold: updateItem.sold ?? 0
      });
    }
    console.log(updateItem);
  }, [updateItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name' && /\d/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'sold' || name.includes('Price') || name === 'inventoryCount'
          ? Number(value)
          : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (updateItem) {
      const updatedParts = garageParts.map((part) =>
        part.id === updateItem.id ? { ...part, ...formData } : part
      );
      setGarageParts(updatedParts);
      setUpdateItem(null);
      resetForm();
      return;
    }

    const newItem = {
      id: Date.now(),
      ...formData
    };
    setGarageParts([...garageParts, newItem]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      inventoryCount: 0,
      retailPrice: 0,
      sellingPrice: 0,
      imageUrl: '',
      sold: 0
    });
    fileInputRef.current.value = null;
    setUpdateItem(null);
  };

  return (
    <div className='p-4 bg-[#171717] min-h-screen flex items-center justify-center'>
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg space-y-5 max-w-[80%] max-md:max-w-[98%] border border-gray-100   w-[80%] max-sm:w-[90%] max-md:mb-[28%] mb-[10%]">
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
              <label className="flex flex-col items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <span className="text-sm text-gray-600">
                  {formData.imageUrl ? 'Change image' : 'Click to upload image'}
                </span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (max 5MB)</span>
              </label>
            </div>
            {formData.imageUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="max-h-40 max-w-full object-contain rounded-lg border border-gray-200"
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
            {updateItem ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPartForm;
