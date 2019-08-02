import React from 'react';
import AppContext from './AppContext'

class AppContextProvider extends React.Component {
  state = {
    facilities: []
  }
  componentDidMount() {
    fetch('http://196.216.12.28:81/api/healthfacilities/get/a4595012')
      .then(res => res.json())
      .then(data => data.map((d: any) => ({ id: Number(d['id']), facilityName: d['facility_name'] })))
      .then(facilities => this.setState({...this.state, facilities}))
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          facilities: this.state.facilities
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider;