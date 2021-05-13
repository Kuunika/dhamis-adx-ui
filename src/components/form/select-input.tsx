import React, { FC, ReactElement } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useFormikContext } from "formik";

interface ISelectFieldInput {
  label: string;
  menuItems: Array<{ value: string | number; label: string }>;
  variant?: any;
  name: string;
  className?: any;
  customHandleChange?: (value: any) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 140,
      marginBottom: "20px",
    },
    helperText: {
      color: "rgb(255, 0, 0)",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const SelectFieldInput: FC<ISelectFieldInput> = ({
  menuItems,
  label,
  variant,
  name,
  className,
  customHandleChange = ({}) => {},
}): ReactElement => {
  const classes = useStyles();
  const { handleChange, values, errors, touched } = useFormikContext();
  const fieldValues: any = values; // temporary
  const fieldTouched: any = touched;
  const fieldErrors: any = errors;
  const error = fieldTouched[name] && Boolean(fieldErrors[name]);

  return (
    <FormControl variant={variant ? variant : "outlined"} className={className}>
      <InputLabel htmlFor={label}>{label}</InputLabel>
      <Select
        id={label}
        value={fieldValues[name] ? fieldValues[name] : ""}
        onChange={(e) => {
          customHandleChange(e);
          handleChange(e);
        }}
        name={name}
        error={error}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {menuItems.map((menu) => (
          <MenuItem key={menu.value} value={menu.value}>
            {menu.label}
          </MenuItem>
        ))}
      </Select>
      {error ? (
        <FormHelperText className={classes.helperText}>
          {fieldTouched[name] && fieldErrors[name]}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default SelectFieldInput;
