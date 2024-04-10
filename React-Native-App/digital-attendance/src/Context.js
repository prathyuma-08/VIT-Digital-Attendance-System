import { createContext, useContext, useState } from "react";

export const userContext = createContext({
  user: null,
  time: null,
  minmaxTime: () =>{},
  setRole: ()=>{},
  logIn: () => {},
  logOut: () => {},
});

const USER_DEF = { name: "Guest", isGuestUser: true,role:null };
const TIME = {mintime: new Date(new Date().setHours(0,0,0,0)),maxtime:new Date(new Date().setHours(0,0,0,0))};

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(USER_DEF);
  const [time,setTime] = useState(TIME);
  function minmaxTime(start,end){
    setTime({mintime: start, maxtime:end});
    console.log("Min time set as ",start.toLocaleTimeString());
    console.log("Max time set as:",end.toLocaleTimeString());
  }
  function logIn(username,role) {
    setUser({isGuestUser: false, name: username,role:role});
  }
  function setRole(role){
    setUser({name: "Guest", isGuestUser: true,role:role})
  }
  function logOut() {
    setUser(USER_DEF);
  }
  return (
    <userContext.Provider value={{user,time, logIn, logOut, setRole, minmaxTime}}>
      {children}
    </userContext.Provider>
  );
}

export function useUserContext() {
  const { user, logIn, logOut,setRole, time, minmaxTime} = useContext(userContext);

  return { user, logIn, logOut,setRole,time, minmaxTime};
}