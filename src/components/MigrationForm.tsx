import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Box, Button, Card, CircularProgress } from "@material-ui/core";
import * as yup from "yup";

import { AppContext } from "../context/AppContext";
import get from "../api/get";
import post from "../api/post";

import { Quarter, Facility, IDhamisResponse } from "../interfaces";
import { createErrorAlert, createSuccessAlert } from "../modules";
import { Form, TextAreaInput, SelectFieldInput } from "./form";

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
    submitButton: {
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

  const handleMigrationFailure = (text: string) => {
    createErrorAlert({ text });
    setValues({ ...values, isMigrating: false });
  };

  const handleSubmit = async (formValues: any) => {
    setValues({ ...values, isMigrating: true });
    const { quarter, year, description } = formValues;

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

    const { REACT_APP_DHAMIS_API_SECRET, REACT_APP_DHAMIS_DATASET } =
      process.env;

    let datasets: string[] = [];
    let dhamisData = {} as IDhamisResponse;

    datasets =
      (REACT_APP_DHAMIS_DATASET && REACT_APP_DHAMIS_DATASET.split(",")) || [];

    for (let dataset of datasets) {
      const response = await get.getDhamisData(_quarter.id, dataset);

      dhamisData =
        !Object.keys(dhamisData).length && response
          ? response
          : response
          ? {
              ...dhamisData,
              facilities: [...dhamisData.facilities, ...response.facilities],
            }
          : ({} as IDhamisResponse);
    }

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
      description: description,
      facilities: filteredFacilities,
    };

    console.log("formatted-response", JSON.stringify(formattedResponse));

    let adxResponse: any = await post.postToIL(formattedResponse);

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
          onSubmit={handleSubmit}
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
                <TextAreaInput
                  name="description"
                  label="Description"
                  id="description"
                  className={classes.textField}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  className={classes.submitButton}
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
