import React from "react";

export type Facility = {
  id: number;
  facilityName: string;
};

export type Quarter = {
  id: number;
  year: number;
  quarter: number;
};

export type AppContextType = {
  // facilities: Facility[], RM
  quarters: Quarter[];
};

const defaultContext = { facilities: [], quarters: [] };

const appContext = React.createContext<AppContextType>(defaultContext);

export default appContext;
