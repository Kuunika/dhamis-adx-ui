import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import styled from 'styled-components';
import './App.css';
import MigrationForm from './components/MigrationForm';
import Header from './components/Header';
import AppContextProvider from './AppContextProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formWrapper: {
      backgroundColor: '#eee',
      paddingTop: '10px',
      paddingBottom: '10px',
      marginTop: '10px'
    }
  }),
);

const AppWrapper = styled.div`
`;

const AppTitle = styled.h1`
  text-align: center
`;

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <AppContextProvider>
      <div className="app">
        <Header />
        <AppWrapper className={classes.formWrapper}>
          <AppTitle>DHAMIS ADX UI</AppTitle>
          <MigrationForm />
        </AppWrapper>
      </div >
    </AppContextProvider>

  );
}

export default App;
