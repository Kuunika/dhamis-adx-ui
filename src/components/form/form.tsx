import React, { FC } from "react";
import { Formik } from "formik";

interface IProps {
  initialValues?: any;
  validationSchema?: any;
  onSubmit: (values: any, isSubmitting?: any) => void;
}

const Form: FC<IProps> = ({
  children,
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, isSubmitting }) => {
        return <form onSubmit={handleSubmit}>{children}</form>;
      }}
    </Formik>
  );
};

export default Form;
