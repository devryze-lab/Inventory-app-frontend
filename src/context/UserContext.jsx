import React, { useState } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({children}) => {
    const [SidebarContext, setSidebarContext] = useState(false)
    return(
        <UserContext.Provider value={{SidebarContext, setSidebarContext}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider