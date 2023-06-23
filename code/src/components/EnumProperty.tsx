import {useEffect, useMemo} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import type {NonEmptyObject} from '../types';

type EnumPropertyProps = {
  Choices: NonEmptyObject;
  Class: string;
  Label: string;
  Value: string;
  Name: string;
};

export function EnumProperty({Value, Label, Class, Choices, Name}: EnumPropertyProps) {
  const arrayKeyValueChoices = useMemo(() => Object.entries(Choices), [Choices]);
  const initialValue = useMemo(
    () => arrayKeyValueChoices[arrayKeyValueChoices.findIndex(([key, _]) => key == Value)][1],
    [Choices]
  );
  console.log(initialValue);
  const formik = useFormik({
    initialValues: {
      [Name]: initialValue,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [Name]: yup.string().required('Поле обязательно для заполения'),
    }),
  });
  //TODO helperText={formik.touched[Name] && formik.errors[Name]}
  return (
    <TextField
      error={formik.touched[Name] && Boolean(formik.errors[Name])}
      className={Class}
      fullWidth
      select
      name={Name}
      value={formik.values[Name]}
      label={Label}
      onChange={formik.handleChange}>
      {arrayKeyValueChoices.map(([key, value]) => {
        console.log(key, value);
        return (
          <MenuItem key={key} value={value}>
            {key}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
