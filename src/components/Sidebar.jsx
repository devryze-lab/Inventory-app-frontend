import React, { useState } from 'react';
import logo from '/logo1.png';
import { MdSpaceDashboard } from "react-icons/md";
import { FaList, FaShoppingCart, FaCashRegister } from "react-icons/fa";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { NavLink } from 'react-router-dom';
import Switch from '../Icons/Switch';
import { MdLogout } from "react-icons/md";


function Sidebar() {

    function logout()
    {
        localStorage.setItem("token",0);
        window.location.reload();
        
    }
    const [sidebarHide, setSidebarHide] = useState(false);

    const navItems = [
        { path: "/", label: "Dashboard", icon: <MdSpaceDashboard className="size-7 max-[350px]:size-5" /> },
        { path: "/itemsList", label: "Items List", icon: <FaList className="size-6 max-[350px]:size-5" /> },
        { path: "/saleList", label: "Sale List", icon: <FaShoppingCart className="size-6 max-[350px]:size-5" /> },
        { path: "/makeList", label: "Make Sale", icon: <FaCashRegister className="size-6 max-[350px]:size-5" /> },
        { path: "/addItems", label: "Add Items", icon: <HiOutlineViewGridAdd className="size-7 max-[350px]:size-5" /> },
    ];

    return (
        <div className='w-fit max-md:w-full bg-[#171717] h-screen max-md:h-[60px] py-5 flex flex-col gap-15 max-md:fixed bottom-0 border-r-[1px] border-white/30 max-md:border-none'>

            <div className={`${sidebarHide ? '' : 'w-[240px]'} flex items-center justify-between pr-4 gap-7 max-md:hidden`}>
                <div className={`${sidebarHide ? 'hidden' : 'px-5 flex items-center gap-4 max-md:flex'}`}>
                    <img className='w-[80px] max-md:block' src={logo} alt="Logo" />
                </div>
                <Switch setSidebarHide={setSidebarHide} sidebarHide={sidebarHide} />
            </div>

            <div className='max-md:fixed max-md:bottom-0 max-md:w-full flex justify-between flex-col max-md:flex-row  '>
                <ul className='max-md:flex max-md:items-center max-md:justify-around max-md:w-full'>
                    {navItems.map(({ path, label, icon }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-5 py-4 max-[360px]:px-4 max-[350px]:gap-0 cursor-pointer duration-700 rounded
                                    ${isActive ? 'bg-white/30 text-white font-semibold' : 'text-white hover:bg-white/20'}`
                                }
                            >
                                {icon}
                                <p className={`${sidebarHide ? 'hidden' : 'text-lg max-md:hidden'}`}>{label}</p>
                            </NavLink>
                        </li>
                    ))}
                    <button className='flex items-center w-full max-md:w-fit gap-4 px-5 py-4 max-[360px]:px-4 max-[350px]:gap-0 cursor-pointer duration-700 rounded  text-white font-semibold hover:bg-white/30 active:bg-white/30' onClick={logout}>
                    <MdLogout className='size-7' />
                        <span className='max-md:hidden'>Log Out</span>
                    </button>
                </ul>
            </div>
            
        </div>
    );
}

export default Sidebar;
