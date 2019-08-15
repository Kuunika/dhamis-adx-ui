import React from 'react';
import logo from './../ministryLogo.png'
import styled from 'styled-components';
import { Grid, Button } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';


const LogoContainer = styled.div`
  padding: .6rem;
`;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    buttonContainer: {
      lineHeight: '50px'
    },
  }),
);

const backToDHIS2 = () => {
  window.history.back();
}

export const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <div>
      <LogoContainer>
        <Grid container spacing={3}>
          <Grid item xs={4} className={classes.buttonContainer}>
            <Button variant="contained" color="primary" onClick={backToDHIS2}>
              <Icon>home</Icon>&nbsp;&nbsp;back to dhis2
            </Button>
          </Grid>
          <Grid item xs={4}>
            <img src={logo} className="logo" alt="malawi government logo" />
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </LogoContainer>
    </div>
  )
}