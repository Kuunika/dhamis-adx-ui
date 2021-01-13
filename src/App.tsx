import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import styled from "styled-components";
import "./App.css";
import { Header, MigrationForm, Footer } from "./components/";
import AppContextProvider from "./AppContextProvider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formWrapper: {
      backgroundColor: "#eee",
      paddingTop: "10px",
      paddingBottom: "10px",
      marginTop: "10px",
    },
  })
);

const AppWrapper = styled.div``;

const AppTitle = styled.h1`
  text-align: center
  font-size: 150%
`;

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <AppContextProvider>
      <div className="app">
        <Header />
        <AppWrapper className={classes.formWrapper}>
          <AppTitle>DHAMIS-DHIS2 APP</AppTitle>
          <MigrationForm />
        </AppWrapper>
        <Footer />
      </div>
    </AppContextProvider>
  );
};

export default App;
