import React, { FC, useState, useEffect } from "react";
import { Quarter, Facility } from "../interfaces";
import get from "../api/get";

export type AppContextType = {
  quarters: Quarter[];
};

const defaultContext = { facilities: [], quarters: [] };

const AppContext = React.createContext<AppContextType>(defaultContext);
const AppContextProvider: FC = ({ children }) => {
  const [quarters, setQuarters] = useState<Quarter[]>([]);

  useEffect(() => {
    (async () => {
      const quarters = await get.getDhamisQuarters();
      setQuarters(quarters ? quarters : []);
    })();
  }, []);

  return (
    <AppContext.Provider value={{ quarters }}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
