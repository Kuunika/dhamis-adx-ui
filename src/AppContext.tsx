import React from 'react';

type Facility = {
  id: number,
  facilityNname: string
}

export type AppContextType = {
  facilities: Facility[]
}

const appContext = React.createContext<AppContextType>({ facilities: [] });

export default appContext;