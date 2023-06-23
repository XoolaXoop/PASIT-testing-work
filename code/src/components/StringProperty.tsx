import {TextField} from '@mui/material';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {useEffect} from 'react';

type StringPropertyProps = {
  Name: string;
  Label: string;
  Class: string;
  Value?: string;
  Help?: string;
};

export function StringProperty({Name, Label, Value, Help, Class}: StringPropertyProps) {
  const formik = useFormik({
    initialValues: {
      [Name]: Value,
    },
    onSubmit: () => {
      console.log(formik.values);
    },
    validationSchema: yup.object({
      [Name]: yup.string().required('Поле обязательно для заполения'),
    }),
  });
  return (
    <TextField
      id={Name}
      name={Name}
      className={Class}
      label={Label}
      value={formik.values[Name]}
      onChange={formik.handleChange}
      error={formik.touched.textValue && Boolean(formik.errors.textValue)}
      helperText={(formik.touched.textValue && formik.errors.textValue) || Help}
    />
  );
}
