import React from "react";
import AppContext from "./AppContext";
import { facilities, quarters } from "./fixtures";

class AppContextProvider extends React.Component {
  state = {
    facilities,
    quarters
  };

  //TODO: Use this function
  async convertResponse(response: Response, converter: Function) {
    const res = await response.json();
    return converter(res);
  }

  async migrate(data: any) {}

  componentDidMount() {
    const formatFacilities = (facility: any) => ({
      id: Number.parseInt(facility["id"]),
      facilityName: facility["facility_name"]
    });

    const formatQuarters = ({ id, year, quarter }: any) => ({
      id: parseInt(id),
      year: parseInt(year),
      quarter: parseInt(quarter)
    });

    //TODO: maybe show one of them dialogs like the rest
    const errorHandler = (error: Error) => {
      console.log(`Error: ${error.message}`);
    };

    const {
      REACT_APP_DHAMIS_API_URL,
      REACT_APP_DHAMIS_API_SECRET
    } = process.env;

    fetch(
      `${REACT_APP_DHAMIS_API_URL}/healthfacilities/get/${REACT_APP_DHAMIS_API_SECRET}`
    )
      .then(res => res.json())
      .then(data => data.map(formatFacilities))
      .then(facilities => this.setState({ ...this.state, facilities }))
      .catch(errorHandler);

    fetch(`${REACT_APP_DHAMIS_API_URL}/quarters/${REACT_APP_DHAMIS_API_SECRET}`)
      .then(res => res.json())
      .then(data => data.map(formatQuarters))
      .then(quarters => this.setState({ ...this.state, quarters }))
      .catch(errorHandler);
  }

  render() {
    const { facilities, quarters } = this.state;
    return (
      <AppContext.Provider
        value={{
          facilities,
          quarters
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
