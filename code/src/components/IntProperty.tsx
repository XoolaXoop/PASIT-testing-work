import {useMemo} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {TextField} from '@mui/material';

type IntPropertyProps = {
  Name: string;
  Class: string;
  Label: string;
  Value: number;
  InlineHelp: string;
  Units: string;
  maxValue: number;
  minValue: number;
};

export function IntProperty(props: IntPropertyProps) {
  const formik = useFormik({
    initialValues: {
      [props.Name]: props.Value,
    },

    onSubmit: () => {},
    validationSchema: yup.object({
      [props.Name]: yup.number().min(props.minValue).max(props.maxValue).required('Поле обязательно для заполения'),
    }),
  });

  return (
    <TextField
      className={props.Class}
      fullWidth
      name={props.Name}
      value={formik.values[props.Name]}
      label={props.Label}
      onChange={formik.handleChange}
      error={formik.touched.intValue && Boolean(formik.errors.intValue)}
      helperText={(formik.touched.intValue && formik.errors.intValue) || props.InlineHelp}
    />
  );
}
