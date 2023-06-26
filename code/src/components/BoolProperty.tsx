import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {handleChangeDecorator} from '../helperFunc';
import {Typography, Box} from '@mui/material';
import {useEffect} from 'react';
import type {ChangeEvent} from 'react';
export type BoolPropertyProps = {
  Name: string;
  Label: string;
  Value: '0' | '1';
  Class: 'wxBoolProperty';
};

export function BoolProperty({Value, Name, Label, Class}: BoolPropertyProps) {
  const formik = useFormik({
    initialValues: {
      [Name]: Value,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [Name]: yup
        .string()
        .required('Поле обязательно для заполнения')
        .test('is-valid', 'Не верный ввод', (value) => {
          return value == '1' || value == '0';
        }),
    }),
  });

  useEffect(() => {
    localStorage.setItem(Name, formik.values[Name]);
  }, [formik]);

  const handleChange = handleChangeDecorator({
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        formik.setFieldValue(Name, '1');
        return '1';
      } else {
        formik.setFieldValue(Name, '0');
        return '0';
      }
    },
    fieldName: Name,
  });

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={formik.values[Name] == '1' ? true : false}
          onChange={handleChange}
          className={Class}
          name={Name}
          value={formik.values[Name]}
        />
      }
      label={
        <Box>
          <Typography variant='body1'>{Label}</Typography>
          {formik.dirty && Boolean(formik.errors[Name]) ? (
            <Typography variant='body1'>{formik.errors[Name]}</Typography>
          ) : null}
        </Box>
      }
    />
  );
}
