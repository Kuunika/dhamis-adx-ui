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
      backgroundColor: '#596187',
      paddingTop: '10px',
      paddingBottom: '10px',
      marginTop: '10px'
    }
  }),
);

const FormWrapper = styled.div`
`;

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <AppContextProvider>
      <div className="app">
        <Header />
        <FormWrapper className={classes.formWrapper}>
          <MigrationForm />
        </FormWrapper>
      </div >
    </AppContextProvider>

  );
}

export default App;
