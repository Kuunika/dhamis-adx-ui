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
import AppContext, { Facility, Quarter } from '../AppContext';
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '30%',
      margin: 'auto',
      marginTop: '2rem',
      marginBottom: '2rem',
      borderRadius: '12px'
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
type FormState = {
  year: number,
  quarter: number,
  description: string,
  facilities: Facility[],
  quarters: Quarter[]
}

type SelectChange = {
  name?: string;
  value: unknown
}

const defaultFormState = {
  year: 0,
  quarter: 0,
  description: '',
  facilities: [],
  quarters: []
}

const MigrationForm: React.FC = () => {
  const classes = useStyles();
  const [values, setValues] = React.useState<FormState>(defaultFormState);

  const resetForm = () => {
    setValues({ ...values, year: 0, quarter: 0, description: '' });
  }

  function handleSelectChange(event: React.ChangeEvent<SelectChange>) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name as string]: event.target.value,
    }));
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const dependenciesAvailable = () => {
    return (values.facilities.length && values.quarters.length)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //TODO: might want to notify user why this stage never got passed
    if (dependenciesAvailable()) {
      const { facilities, quarters, quarter, year } = values;

      //TODO: remove the slicing from the code, need to look into a real solution
      const ids = facilities
        .filter(facility => facility.id)
        .slice(0, 100)
        .reduce((accumulator, current) => `${accumulator},${current.id}`, '')
        .slice(1);
      const _quarter = quarters.find(q => (q.quarter === quarter && q.year === year));
      if (_quarter) {
        const { REACT_APP_DHAMIS_API_URL, REACT_APP_DHAMIS_API_SECRET } = process.env;
        const data = await fetch(
          `${REACT_APP_DHAMIS_API_URL}/artclinic/get/${REACT_APP_DHAMIS_API_SECRET}/${_quarter.id}/${ids}`
        ).then(res => res.json()).catch(e => console.log(e.message));

        //TODO: provide logic to be done when it failed to collect the dhamis data
        if (data) {
          console.log(data);
          const {
            REACT_APP_INTEROP_API_URL_ENDPOINT,
            REACT_APP_INTEROP_USERNAME,
            REACT_APP_INTEROP_PASSWORD
          } = process.env;
          await axios({
            url: `${REACT_APP_INTEROP_API_URL_ENDPOINT}/data-elements`,
            method: 'post',
            data,
            auth: {
              username: `${REACT_APP_INTEROP_USERNAME}`,
              password: `${REACT_APP_INTEROP_PASSWORD}`
            }
          }).then(data => console.log(data))
          await setTimeout(resetForm, 2000);
        }
      }
    }
  }

  const isYearSelected = (year: number): boolean => {
    return new Date().getFullYear() === year;
  }

  return (
    <AppContext.Consumer>
      {(context) => {
        const { facilities, quarters } = context;
        values.facilities = facilities;
        values.quarters = quarters;

        return (
          <Card className={classes.container}>
            <Box component="div" m={5}>
              <form onSubmit={handleSubmit}>
                <Box>
                  <Grid container>
                    <Grid item xs={6} style={{ paddingRight: '5px' }}>
                      <FormControl className={classes.select}>
                        <InputLabel htmlFor="year">Year</InputLabel>
                        <Select
                          value={values.year}
                          onChange={handleSelectChange}
                          required
                          inputProps={{
                            name: 'year',
                            id: 'year',
                          }}
                        >
                          {Array.from(new Set(quarters.map(quarter => quarter.year))).map(year => (
                            <MenuItem key={year} selected={isYearSelected(year)} value={year}>{year}</MenuItem>
                          )
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} style={{ paddingLeft: '5px' }}>
                      <FormControl className={classes.select}>
                        <InputLabel htmlFor="quarter">Quarter</InputLabel>
                        <Select
                          value={values.quarter}
                          onChange={handleSelectChange}
                          required
                          inputProps={{
                            name: 'quarter',
                            id: 'quarter',
                          }}
                        >
                          <MenuItem key={1} value={1}>Quarter 1</MenuItem>
                          <MenuItem key={2} value={2}>Quarter 2</MenuItem>
                          <MenuItem key={3} value={3}>Quarter 3</MenuItem>
                          <MenuItem key={4} value={4}>Quarter 4</MenuItem>
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
        )
      }}
    </AppContext.Consumer>
  )
}

export default MigrationForm;