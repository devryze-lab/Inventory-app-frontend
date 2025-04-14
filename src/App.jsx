import { useState } from 'react'
import './App.css'
import AddItems from './components/AddItems'
import Dashboard from './components/Dashboard'
import ItemsList from './components/ItemsList'
import MakeSale from './components/MakeSale'
import SaleList from './components/SaleList'
import Sidebar from './components/Sidebar'
import {Routes, Route} from 'react-router-dom'

const initialGarageParts = [
  {
    id: 1,
    name: "Brake Pads",
    category: "Brakes",
    inventoryCount: 42,
    retailPrice: 20,
    sellingPrice: 25,
    imageUrl: "https://www.boschautoparts.com/documents/647135/656978/BlueDiscPads_PDP_Carousel.jpg",
    sold: 18,
  },
  {
    id: 2,
    name: "Engine Oil",
    category: "Engine",
    inventoryCount: 22,
    retailPrice: 15,
    sellingPrice: 18,
    imageUrl: "https://shift.pk/cdn/shop/files/Engine_Oil.png?v=1635491250",
    sold: 13,
  },
  {
    id: 3,
    name: "Air Filter",
    category: "Engine",
    inventoryCount: 35,
    retailPrice: 12,
    sellingPrice: 16,
    imageUrl: "https://autoimage.capitalone.com/cms/Auto/assets/images/2151-hero-how-to-pick-the-right-engine-air-filter.jpg",
    sold: 15,
  },
  {
    id: 4,
    name: "Spark Plugs",
    category: "Engine",
    inventoryCount: 28,
    retailPrice: 8,
    sellingPrice: 12,
    imageUrl: "https://i.ytimg.com/vi/OQtoRWB-Lhg/maxresdefault.jpg",
    sold: 12,
  },
  {
    id: 5,
    name: "Windshield Wipers",
    category: "Exterior",
    inventoryCount: 20,
    retailPrice: 10,
    sellingPrice: 15,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYqJl6__GW-PSpwY3m8kd3DTWjg-GLrxXRNQ&s",
    sold: 10,
  },
  {
    id: 6,
    name: "Battery",
    category: "Electrical",
    inventoryCount: 15,
    retailPrice: 80,
    sellingPrice: 100,
    imageUrl: "https://www.battery.co.za/wp-content/uploads/2024/04/668B_FNB_BRONZE-1024x1024.png",
    sold: 5,
  },
  {
    id: 7,
    name: "Headlight Bulbs",
    category: "Electrical",
    inventoryCount: 30,
    retailPrice: 15,
    sellingPrice: 22,
    imageUrl: "https://cache2.pakwheels.com/ad_pictures/9721/h4-halogen-bulb-12v-100-90w-rainbow-set-97211111.webp",
    sold: 8,
  },
  {
    id: 8,
    name: "Radiator",
    category: "Cooling",
    inventoryCount: 12,
    retailPrice: 120,
    sellingPrice: 150,
    imageUrl: "https://bestparts.ca/cdn/shop/articles/1_How_to_Replace_a_Radiator_a_radiator_1000x.webp?v=1722746470",
    sold: 3,
  },
  {
    id: 9,
    name: "Tire Set (4)",
    category: "Wheels",
    inventoryCount: 8,
    retailPrice: 300,
    sellingPrice: 400,
    imageUrl: "https://media.istockphoto.com/id/994415414/photo/car-wheel-set.jpg?s=612x612&w=0&k=20&c=IyaV9jxoaGUwNU8dWLsPofSNqSgxBJlorngVC1k5gpw=",
    sold: 2,
  },
  {
    id: 10,
    name: "Shock Absorbers",
    category: "Suspension",
    inventoryCount: 18,
    retailPrice: 65,
    sellingPrice: 85,
    imageUrl: "https://m.media-amazon.com/images/I/81Ns5JPE5VL._AC_UF1000,1000_QL80_.jpg",
    sold: 6,
  },
  {
    id: 11,
    name: "Alternator",
    category: "Electrical",
    inventoryCount: 10,
    retailPrice: 150,
    sellingPrice: 200,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgIcOMIqDPl_R48oI2Do7Rl8XEvLKOwvnfZw&s",
    sold: 4,
  },
  {
    id: 12,
    name: "Brake Rotors",
    category: "Brakes",
    inventoryCount: 25,
    retailPrice: 45,
    sellingPrice: 60,
    imageUrl: "https://www.htsaves.com/wp-content/uploads/2024/07/Brake-Rotors-5205027.jpg",
    sold: 9,
  }
];

const initialSalesHistory = [
  {
    id: 1,
    partId: 2,
    quantitySold: 3,
    totalBill: 1200,
    date: '2025-04-10T10:30:00'
  },
  {
    id: 2,
    partId: 4,
    quantitySold: 1,
    totalBill: null,
    date: '2025-04-11T14:45:00'
  },
  {
    id: 3,
    partId: 1,
    quantitySold: 2,
    totalBill: 50,
    date: '2025-04-12T09:15:00'
  },
  {
    id: 4,
    partId: 6,
    quantitySold: 1,
    totalBill: 100,
    date: '2025-04-12T11:20:00'
  },
  {
    id: 5,
    partId: 3,
    quantitySold: 4,
    totalBill: 64,
    date: '2025-04-13T13:10:00'
  },
  {
    id: 6,
    partId: 7,
    quantitySold: 2,
    totalBill: 44,
    date: '2025-04-13T15:30:00'
  },
  {
    id: 7,
    partId: 5,
    quantitySold: 3,
    totalBill: 45,
    date: '2025-04-14T10:45:00'
  },
  {
    id: 8,
    partId: 8,
    quantitySold: 1,
    totalBill: 150,
    date: '2025-04-14T16:20:00'
  },
  {
    id: 9,
    partId: 9,
    quantitySold: 1,
    totalBill: 400,
    date: '2025-03-29T10:00:00'
  },
  {
    id: 10,
    partId: 10,
    quantitySold: 2,
    totalBill: 170,
    date: '2025-03-25T14:30:00'
  }
];
function App() {
  const [garageParts, setGarageParts] = useState(initialGarageParts);
  const [salesHistory, setSalesHistory] = useState(initialSalesHistory);

  const handleSale = (partId, quantitySold, totalBill = null) => {
    const updatedParts = garageParts.map(part =>
      part.id === partId
        ? {
            ...part,
            inventoryCount: part.inventoryCount - quantitySold,
            sold: part.sold + quantitySold
          }
        : part
    );
    setGarageParts(updatedParts);
  
    const newSale = {
      id: salesHistory.length + 1,
      partId: partId,
      quantitySold: quantitySold,
      totalBill: totalBill !== null ? totalBill : null, // add this line
      date: new Date().toISOString()
    };
  
    setSalesHistory(prev => [...prev, newSale]);
  };
  return (
    <div className='flex overflow-hidden'>
      <Sidebar />
      <div className='h-screen w-[100%] overflow-y-auto'>
        <Routes>
          <Route
            path="/"
            element={<Dashboard garageParts={garageParts} salesHistory={salesHistory} />}
          />
          <Route
            path="/itemsList"
            element={
              <ItemsList
                garageParts={garageParts}
                onSale={handleSale}
                setGarageParts={setGarageParts}
                setSalesHistory={setSalesHistory}
                salesHistory={salesHistory}
              />
            }
          />
          <Route path="/saleList" element={<SaleList salesHistory={salesHistory} setSalesHistory={setSalesHistory} garageParts={garageParts} setGarageParts={setGarageParts} />} />
          <Route path="/makeList" element={<MakeSale garageParts={garageParts} setGarageParts={setGarageParts} salesHistory={salesHistory} setSalesHistory={setSalesHistory} />} />
          <Route path="/addItems" element={<AddItems garageParts={garageParts} setGarageParts={setGarageParts} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;