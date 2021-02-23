import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CircularProgress,
} from "@material-ui/core";

import AppContext, { Facility, Quarter } from "../AppContext";
import axios from "axios";
import { createErrorAlert, createSuccessAlert } from "../modules";
import { data as dd } from "../fixtures";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: "30%",
      margin: "auto",
      marginTop: "2rem",
      marginBottom: "2rem",
      borderRadius: "9px",
    },
    select: {
      width: "100%",
    },
    textField: {
      width: "100%",
      marginTop: theme.spacing(2),
    },
    submittButton: {
      width: "100%",
      marginTop: theme.spacing(4),
    },
    migratingIndicator: {
      color: "white",
      float: "left",
      marginRight: "5px",
    },
    migratingButton: {
      fontWeight: "bold",
    },
  })
);

type FormState = {
  year: number;
  quarter: number;
  description: string;
  facilities: Facility[];
  quarters: Quarter[];
  isMigrating: boolean;
};

type SelectChange = {
  name?: string;
  value: unknown;
};

const defaultFormState = {
  year: 0,
  quarter: 0,
  description: "",
  facilities: [],
  quarters: [],
  isMigrating: false,
};

export const MigrationForm: React.FC = () => {
  const classes = useStyles();
  const [values, setValues] = React.useState<FormState>(defaultFormState);
  const { quarters } = useContext(AppContext);

  const resetForm = () => {
    setValues({
      ...values,
      year: 0,
      quarter: 0,
      description: "",
      isMigrating: false,
    });
  };

  function handleFieldChange(
    event: React.ChangeEvent<SelectChange | HTMLInputElement>
  ) {
    setValues({ ...values, [event.target.name as string]: event.target.value });
  }

  const dependenciesAvailable = (facilities: any[], quarters: any[]) => {
    // return facilities.length && quarters.length; RM
    return quarters.length;
  };

  // const filterNullFacilities = (facility: any) =>
  //   facility["facility-code"] !== null;

  // const formatProducts = (facilities: any[]) => {
  //   if (facilities instanceof Array) {
  //     return facilities.map((facility: any) => {
  //       if (facility.values && facility.values instanceof Array) {
  //         return {
  //           ...facility,
  //           values: facility.values.map((value: any) => ({
  //             "product-code": value["product-code"] || "null",
  //             value: value["value"] || 0,
  //           })),
  //         };
  //       }
  //       return { ...facility, values: [{ "product-code": "null", value: 0 }] };
  //     });
  //   }
  //   return [];
  // }; RM

  //TODO: workout on the slicing element
  // const getFacilityIds = (facilities: any[]) =>
  //   facilities
  //     .filter((facility) => facility.id)
  //     .slice(0, 900)
  //     .reduce((accumulator, current) => `${accumulator},${current.id}`, "")
  //     .slice(1); RM

  const handleMigrationFailure = (text: string) => {
    createErrorAlert({ text });
    setValues({ ...values, isMigrating: false });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValues({ ...values, isMigrating: true });
    const { facilities, quarter, year } = values;

    // if (!dependenciesAvailable(facilities, quarters)) {
    //   handleMigrationFailure("Failed to fetch dependencies, please try again");
    //   return;
    // } RM

    if (!quarters.length)
      return handleMigrationFailure(
        "Failed to fetch dependencies, please try again"
      );

    //TODO: remove the slicing from the code, need to look into a real solution
    // const ids = getFacilityIds(facilities); RM

    const _quarter = quarters.find(
      (q) => q.quarter === quarter && q.year === year
    );

    if (!_quarter) {
      handleMigrationFailure(
        "Failed to find selected quarter, please try again"
      );
      return;
    }

    const {
      REACT_APP_DHAMIS_API_URL,
      REACT_APP_DHAMIS_API_SECRET,
      REACT_APP_DHAMIS_DATASET,
    } = process.env;

    // const url = `${REACT_APP_DHAMIS_API_URL}/${REACT_APP_DHAMIS_DATASET}/get/${REACT_APP_DHAMIS_API_SECRET}/${_quarter.id}/${ids}`; RM
    const url = `${REACT_APP_DHAMIS_API_URL}/${REACT_APP_DHAMIS_DATASET}/get/${REACT_APP_DHAMIS_API_SECRET}/${_quarter.id}`;

    let dhamisData;

    try {
      dhamisData = await (await axios(url)).data;
    } catch (error) {}

    // dhamisData = dd;
    if (!dhamisData) {
      handleMigrationFailure(
        "Failed to fetch data for specified period, please try again"
      );
      return;
    }

    // const dhamisFacilites = dhamisData.facilities.filter(filterNullFacilities); RM
    // const validFacilities = formatProducts(dhamisFacilites); RM
    const data = {
      ...dhamisData,
      // facilities: validFacilities, RM
      description: values.description,
    };
    const {
      REACT_APP_INTEROP_API_URL_ENDPOINT,
      REACT_APP_INTEROP_USERNAME,
      REACT_APP_INTEROP_PASSWORD,
    } = process.env;

    // console.log(REACT_APP_INTEROP_USERNAME, REACT_APP_INTEROP_PASSWORD);

    let adxResponse: any = await axios({
      url: `${REACT_APP_INTEROP_API_URL_ENDPOINT}/dhis2/data-elements`,
      method: "post",
      data,
      auth: {
        username: `${REACT_APP_INTEROP_USERNAME}`,
        password: `${REACT_APP_INTEROP_PASSWORD}`,
      },
    }).catch((error) => console.log(error.message));

    if (!adxResponse || adxResponse.status !== 202) {
      const text = "Failed to send data to the interoperability layer";
      createErrorAlert({ text });
      return;
    }
    const html = `
        <p>You will recieve an Email once the migration is processed</p>
      `;
    createSuccessAlert(adxResponse.data.notificationsChannel, { html });
    setTimeout(resetForm, 2000);
  };
  const quarterLiterals = Array(4)
    .fill(0)
    .map((_, i) => i + 1);
  const { isMigrating } = values;

  return (
    <Card className={classes.container} elevation={8}>
      <Box component="div" m={5}>
        <form onSubmit={handleSubmit}>
          <Box>
            <Grid container>
              <Grid item xs={6} style={{ paddingRight: "5px" }}>
                <FormControl className={classes.select}>
                  <InputLabel htmlFor="year">Year</InputLabel>
                  <Select
                    value={values.year}
                    onChange={handleFieldChange}
                    required
                    id="year"
                    inputProps={{
                      name: "year",
                      id: "year",
                    }}
                  >
                    {Array.from(
                      new Set(quarters.map((quarter) => quarter.year))
                    ).map((year) => (
                      <MenuItem key={year} value={year} data-test={`op${year}`}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} style={{ paddingLeft: "5px" }}>
                <FormControl className={classes.select}>
                  <InputLabel htmlFor="quarter">Quarter</InputLabel>
                  <Select
                    value={values.quarter}
                    onChange={handleFieldChange}
                    required
                    id="quarter"
                    inputProps={{
                      name: "quarter",
                      id: "quarter",
                    }}
                  >
                    {quarterLiterals.map((ql) => (
                      <MenuItem key={ql} value={ql}>
                        Quarter {ql}
                      </MenuItem>
                    ))}
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
                  onChange={handleFieldChange}
                  value={values.description}
                  name="description"
                  inputProps={{
                    name: "description",
                    id: "description",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  className={classes.submittButton}
                  variant="contained"
                  color="primary"
                  type="submit"
                  id="migrate"
                  data-test="submit"
                  disabled={isMigrating}
                >
                  {isMigrating && (
                    <CircularProgress
                      size={18}
                      className={classes.migratingIndicator}
                    />
                  )}
                  <span className={classes.migratingButton}>
                    {isMigrating ? "Migrating..." : "Migrate"}
                  </span>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
    </Card>
  );
};
