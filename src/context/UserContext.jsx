import React, { useState } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({children}) => {
    const [updateItem, setUpdateItem] = useState('')
    return(
        <UserContext.Provider value={{updateItem, setUpdateItem}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider