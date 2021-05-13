import React from "react";
import { Quarter, Facility } from "../interfaces";

export type AppContextType = {
  quarters: Quarter[];
};

const defaultContext = { facilities: [], quarters: [] };

const appContext = React.createContext<AppContextType>(defaultContext);

export default appContext;
