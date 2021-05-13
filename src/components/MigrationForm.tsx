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

import AppContext, { Facility, Quarter } from "../context/AppContext";
import axios from "axios";
import { createErrorAlert, createSuccessAlert } from "../modules";
import { data as dd } from "../fixtures";
import { IDhamisResponse } from "../interfaces";
import * as yup from "yup";
import { Form } from "./form";
import SelectFieldInput from "./form/select-input";
import TextFieldInput from "./form/text-area-input";

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

  const handleMigrationFailure = (text: string) => {
    createErrorAlert({ text });
    setValues({ ...values, isMigrating: false });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValues({ ...values, isMigrating: true });
    const { quarter, year } = values;

    if (!quarters.length)
      return handleMigrationFailure(
        "Failed to fetch dependencies, please try again"
      );

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

    // const url = `${REACT_APP_DHAMIS_API_URL}/${REACT_APP_DHAMIS_DATASET}/get/${REACT_APP_DHAMIS_API_SECRET}/${_quarter.id}`;
    const url = `${REACT_APP_DHAMIS_API_URL}/${REACT_APP_DHAMIS_DATASET}/${_quarter.id}`;

    // const url = "http://localhost:4000/artclinic/72";

    let dhamisData;

    try {
      dhamisData = (await (await axios(url)).data) as IDhamisResponse;
    } catch (error) {}

    // dhamisData = dd;
    if (!dhamisData) {
      handleMigrationFailure(
        "Failed to fetch data for specified period, please try again"
      );
      return;
    }

    const { facilities } = dhamisData;

    // remove facilities without codes
    let filteredFacilities = facilities.filter(
      (facility) => facility["facility-code"]
    );

    // remove null values
    filteredFacilities = filteredFacilities
      .map((facility) => ({
        ...facility,
        "facility-code": facility["facility-code"].toString(),
        values: facility.values.filter(
          (value) => value["product-code"] && value["value"]
        ),
      }))
      .map((facility) => ({
        ...facility,
        values: facility.values.map((product) => ({
          "product-code": product["product-code"],
          value: product["value"],
        })),
      }));

    // prepared payload
    const formattedResponse = {
      ...dhamisData,
      description: values.description,
      facilities: filteredFacilities,
    };

    const {
      REACT_APP_INTEROP_API_URL_ENDPOINT,
      REACT_APP_INTEROP_USERNAME,
      REACT_APP_INTEROP_PASSWORD,
    } = process.env;

    // console.log(REACT_APP_INTEROP_USERNAME, REACT_APP_INTEROP_PASSWORD);

    console.log("formatted-response", JSON.stringify(formattedResponse));

    let adxResponse: any = await axios({
      url: `${REACT_APP_INTEROP_API_URL_ENDPOINT}/dhis2/data-elements`,
      method: "post",
      data: formattedResponse,
      auth: {
        username: `${REACT_APP_INTEROP_USERNAME}`,
        password: `${REACT_APP_INTEROP_PASSWORD}`,
      },
    }).catch((error) => console.log(error));

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

  const validationSchema = yup.object({
    year: yup.string().required("year is required"),
    description: yup.string().required("description is required"),
    quarter: yup.string().required("quarter is required"),
  });

  const years = Array.from(
    new Set(quarters.map((quarter) => quarter.year))
  ).map((year) => ({
    value: year,
    label: year.toString(),
  }));

  const quarterLiteralsList = quarterLiterals.map((quarter) => ({
    value: quarter,
    label: `Quarter ${quarter}`,
  }));

  return (
    <Card className={classes.container} elevation={8}>
      <Box component="div" m={5}>
        <Form
          validationSchema={validationSchema}
          initialValues={{ year: "", quarter: "", description: "" }}
          onSubmit={(values) => console.log(values)}
        >
          <Box>
            <Grid container>
              <Grid item xs={6} style={{ paddingRight: "5px" }}>
                <SelectFieldInput
                  label="Year"
                  name="year"
                  menuItems={years}
                  className={classes.select}
                />
              </Grid>
              <Grid item xs={6} style={{ paddingRight: "5px" }}>
                <SelectFieldInput
                  label="Quarter"
                  name="quarter"
                  className={classes.select}
                  menuItems={quarterLiteralsList}
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldInput
                  name="description"
                  label="Description"
                  id="description"
                  className={classes.textField}
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
        </Form>
      </Box>
    </Card>
  );
};
