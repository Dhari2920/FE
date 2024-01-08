import React, { createContext, useContext, useState } from "react";


export const AppContext = createContext(null)

export default function AppProvider({children}){
    const [user,setUser] = useState(null)
    const [quote,setQuote] = useState(null)
    const [service,setService] = useState(null)
    const [employee,setEmployee] = useState(null)
    const [ticket,setTicket] = useState(null)
    const [employeeTicket,setEmployeeTicket] = useState(null)
    const [employeeQuote,setEmployeeQuote] = useState(null)
    const [profile,setProfile] = useState(null)
    
    return(
        <AppContext.Provider
        value={{
            user,
            setUser,
            quote,
            setQuote,
            service,
            setService,
            employee,
            setEmployee,
            ticket,
            setTicket,
            employeeTicket,
            setEmployeeTicket,
            employeeQuote,
            setEmployeeQuote,
            profile,
            setProfile
        }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const AppState = ()=>{
    return useContext(AppContext)
}