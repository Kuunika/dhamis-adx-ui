import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card
} from '@material-ui/core';
import AppContext from '../AppContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '30%',
      margin: 'auto',
      marginTop: '2rem',
      marginBottom: '2rem'
    },
    select: {
      width: '100%',
    },
    textField: {
      width: '100%',
      marginTop: theme.spacing(2)
    },
    submittButton: {
      width: '100%',
      marginTop: theme.spacing(4)
    }
  }),
);

const MigrationForm: React.FC = () => {
  const classes = useStyles();
  const formRef = React.createRef<HTMLFormElement>();

  const [values, setValues] = React.useState({
    year: 0,
    quarter: 0,
    description: ''
  });

  function handleChange(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name as string]: event.target.value,
    }));
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <AppContext.Consumer>
      {(context) => (
        <Card className={classes.container}>
          <Box component="div" m={8}>
            <form onSubmit={handleSubmit} ref={formRef}>
              <Box>
                <Grid container>
                  <Grid item xs={6}>
                    <FormControl className={classes.select}>
                      <InputLabel htmlFor="year">Year</InputLabel>
                      <Select
                        value={values.year}
                        onChange={handleChange}
                        inputProps={{
                          name: 'year',
                          id: 'year',
                        }}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={classes.select}>
                      <InputLabel htmlFor="quarter">Quarter</InputLabel>
                      <Select
                        value={values.quarter}
                        onChange={handleChange}
                        inputProps={{
                          name: 'quarter',
                          id: 'quarter',
                        }}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="standard-multiline-static"
                      label="Description"
                      multiline
                      rows="4"
                      className={classes.textField}
                      onChange={handleTextChange}
                      value={values.description}
                      name="description"
                      inputProps={{
                        name: 'description',
                        id: 'description',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      className={classes.submittButton}
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Migrate
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Box>
        </Card>
      )}
    </AppContext.Consumer>
  )
}

export default MigrationForm;