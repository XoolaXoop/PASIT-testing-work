import {useMemo} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import type {NonEmptyObject} from '../types';
import {handleChangeDecorator} from '../helperFunc';
import {useEffect} from 'react';

export type EnumPropertyProps = {
  Choices: NonEmptyObject;
  Class: 'wxEnumProperty';
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

  const formik = useFormik({
    initialValues: {
      [Name]: initialValue,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [Name]: yup.string().required('Поле обязательно для заполения'),
    }),
  });

  const handleChange = handleChangeDecorator({
    setFieldValue: formik.setFieldValue,
    fieldName: Name,
  });

  useEffect(() => {
    localStorage.setItem(Name, Value);
  }, []);

  return (
    <TextField
      error={formik.dirty && Boolean(formik.errors[Name])}
      className={Class}
      fullWidth
      select
      name={Name}
      value={formik.values[Name]}
      label={Label}
      helperText={formik.dirty && formik.errors[Name] && 'Не верный ввод'}
      onChange={handleChange}>
      {arrayKeyValueChoices.map(([key, value]) => {
        return (
          <MenuItem key={key} value={value}>
            {key}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
