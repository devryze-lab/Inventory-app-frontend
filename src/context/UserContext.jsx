import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from 'axios'

const UserContextProvider = ({children}) => {
    const [updateItem, setUpdateItem] = useState('')
    const [garageParts, setGarageParts] = useState([])
    const [salesHistory, setSalesHistory] = useState([])

    useEffect(() => {
        axios.get('https://inventory-app-backend-uf6l.onrender.com/api/garage-Parts').then(res => setGarageParts(res.data));
        axios.get('https://inventory-app-backend-uf6l.onrender.com/api/sales').then(res => setSalesHistory(res.data))
    }, [])
    

    return(
        <UserContext.Provider value={{updateItem, setUpdateItem, garageParts,  setGarageParts, salesHistory, setSalesHistory}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider