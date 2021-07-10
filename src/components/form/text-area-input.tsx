import React, { FC, ReactElement } from "react";
import TextField from "@material-ui/core/TextField";
import { useFormikContext } from "formik";

interface ITextField {
  label: string;
  id: string;
  variant?: any;
  name: string;
  className?: any;
}

const TextFieldInput: FC<ITextField> = ({
  label,
  id,
  name,
  variant,
  className,
}): ReactElement => {
  const { handleChange, values, errors, touched } = useFormikContext();

  const fieldValues: any = values; // temporary
  const fieldTouched: any = touched;
  const fieldErrors: any = errors;

  return (
    <TextField
      style={{ marginBottom: "20px" }}
      name={name}
      id={id}
      label={label}
      multiline
      value={fieldValues[name]}
      onChange={handleChange}
      error={fieldTouched[name] && Boolean(fieldErrors[name])}
      helperText={fieldTouched[name] && fieldErrors[name]}
      className={className}
      rows="4"
    />
  );
};

export default TextFieldInput;
