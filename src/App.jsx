import './App.css';
import AddItems from './components/AddItems';
import Dashboard from './components/Dashboard';
import ItemsList from './components/ItemsList';
import MakeSale from './components/MakeSale';
import SaleList from './components/SaleList';
import Sidebar from './components/Sidebar';
import Loginpage from './components/Loginpage';
import { Routes, Route } from 'react-router-dom';
import { div } from 'framer-motion/client';

function App() {

  const token = localStorage.getItem("token");
  return (
    <>
    {token == 0 &&
    <div> <Loginpage/></div>
    }
    {token == 1 && 
    <div className="flex overflow-hidden">
      <Sidebar />
      <div className="h-screen w-[100%] overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard  />} />
          <Route
            path="/itemsList"
            element={<ItemsList />}
          />
          <Route
            path="/saleList"
            element={<SaleList  />}
          />
          <Route
            path="/makeList"
            element={<MakeSale />}
          />
          <Route
            path="/addItems"
            element={<AddItems />}
          />
        </Routes>
      </div>
    </div>
    }
    </>
  );
}

export default App;
